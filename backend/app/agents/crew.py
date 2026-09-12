"""CrewAI surveillance agents with a provider fallback chain.

The agents plan investigations, summarize evidence and answer operator
questions. They only see data returned by the deterministic tools; they never
compute risk or invent observations, and they never declare wrongdoing.
"""
import logging
from dataclasses import dataclass
from typing import Callable, Dict, List, Optional, Tuple

from app.agents.crew_tools import build_tools
from app.agents.providers import build_llm_for, configured_providers
from app.agents.toolkit import SurveillanceToolkit
from app.config import settings

logger = logging.getLogger("oceansentinel.agents")
SAFETY_RULES = (
    "Use only facts returned by your tools. Never invent vessel observations. "
    "Report risk as a suspicion indicator for human review, never as proof of illegal activity. "
    "Always mention benign explanations where plausible (equipment failure, coverage loss, authorized activity)."
)


class LLMNotConfiguredError(RuntimeError):
    pass


class AgentRunError(RuntimeError):
    """Every configured LLM provider failed (quota, network, malformed output)."""


@dataclass(frozen=True)
class AgentResult:
    text: str
    provider: str
    model: str


def llm_configured() -> bool:
    return bool(configured_providers())


def build_llm():
    """LLM for the first configured provider; crews built directly (not via run_with_fallback) use it."""
    providers = configured_providers()
    if not providers:
        raise LLMNotConfiguredError("No LLM provider key is set (GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY).")
    return build_llm_for(providers[0])


def _session_tools() -> Tuple[List, object]:
    from app.database import SessionLocal
    session = SessionLocal()
    return build_tools(SurveillanceToolkit(lambda: session)), session


def _agent(role: str, goal: str, backstory: str, tools: List, llm):
    from crewai import Agent  # type: ignore
    return Agent(role=role, goal=goal, backstory=f"{backstory} {SAFETY_RULES}", tools=tools, llm=llm,
                 verbose=False, allow_delegation=False, max_iter=8)


def build_surveillance_crew(vessel_id: int, llm=None, tools: Optional[List] = None):
    """Four specialists investigate one vessel in sequence and hand the lead a structured summary."""
    from crewai import Crew, Process, Task  # type: ignore

    llm = llm or build_llm()
    tools = tools or _session_tools()[0]
    by_name: Dict[str, object] = {t.name: t for t in tools}
    pick = lambda *names: [by_name[n] for n in names]  # noqa: E731

    ais_agent = _agent(
        "AIS Monitoring Analyst",
        "Establish exactly when and where the vessel stopped and resumed AIS reporting.",
        "You review raw AIS reporting behaviour and dark periods for maritime surveillance.",
        pick("get_vessel", "get_vessel_track", "get_ais_gaps"), llm,
    )
    fishing_agent = _agent(
        "Fishing Activity Analyst",
        "Determine whether the vessel's movement resembles fishing and whether it happened inside regulated zones.",
        "You interpret speed, turning and loitering patterns and compare them against fishing zones and protected areas.",
        pick("get_vessel_track", "get_zone_events", "get_events"), llm,
    )
    anomaly_agent = _agent(
        "Behavioral Anomaly Analyst",
        "Identify rendezvous, deviations and other anomalies and explain how the risk factors combine.",
        "You look for vessel interactions and behaviour that departs from normal transit.",
        pick("get_events", "get_vessel_track", "get_risk"), llm,
    )
    lead = _agent(
        "Investigation Lead",
        "Produce a clear, evidence-backed investigation summary and a recommended next action for a human reviewer.",
        "You assemble specialist findings into a case file an operator can act on in under a minute.",
        pick("get_risk", "get_evidence", "get_investigation_case", "list_open_cases"), llm,
    )

    ais_task = Task(
        description=f"Review AIS reporting for vessel {vessel_id}. Use get_ais_gaps and get_vessel_track. "
                    "List every gap with start, end, duration and where the vessel went dark and reappeared.",
        expected_output="Bullet list of AIS findings with timestamps and positions, or a statement that reporting was continuous.",
        agent=ais_agent,
    )
    fishing_task = Task(
        description=f"Assess fishing-like behaviour for vessel {vessel_id}. Use get_events and get_zone_events. "
                    "State which zones were entered, their type, dwell time, and whether fishing patterns or loitering were detected.",
        expected_output="Bullet list of zone and behaviour findings with scores and zone names.",
        agent=fishing_agent,
    )
    anomaly_task = Task(
        description=f"Identify anomalies for vessel {vessel_id}: rendezvous with other vessels, unusual routes, speed changes. "
                    "Use get_events and get_risk. Explain how the detected factors reinforce or contradict each other.",
        expected_output="Bullet list of anomalies plus a short paragraph on how the factors combine.",
        agent=anomaly_agent,
    )
    lead_task = Task(
        description=f"Write the investigation summary for vessel {vessel_id} using the specialists' findings and get_evidence. "
                    "Sections: Headline (one sentence), Risk (score and level), Evidence (numbered, strongest first), "
                    "Benign explanations to rule out, Recommended action (MONITOR, ESCALATE or NEED MORE DATA) with reason.",
        expected_output="A structured plain-text case summary with the five sections above, times as HH:MM, "
                        "distances to one decimal, no markdown tables.",
        agent=lead,
        context=[ais_task, fishing_task, anomaly_task],
    )
    return Crew(agents=[ais_agent, fishing_agent, anomaly_agent, lead],
                tasks=[ais_task, fishing_task, anomaly_task, lead_task], process=Process.sequential,
                max_rpm=settings.GEMINI_MAX_RPM, verbose=False)


def build_assistant_crew(question: str, llm=None, tools: Optional[List] = None):
    """One assistant agent with every tool answers a natural-language operator question."""
    from crewai import Crew, Process, Task  # type: ignore

    llm = llm or build_llm()
    tools = tools or _session_tools()[0]
    assistant = _agent(
        "Maritime Intelligence Assistant",
        "Answer operator questions about vessels, AIS gaps, zones, risk and investigations using tool data only.",
        "You are the query interface of a maritime surveillance command center. You never guess: if a tool "
        "returns nothing, say the data is not available.",
        tools, llm,
    )
    task = Task(
        description=f"Operator question: {question}\nUse the tools to gather facts, then answer concisely. "
                    "Cite vessel ids, names and scores exactly as the tools returned them. Write times as HH:MM "
                    "(drop dates and seconds unless asked about a date), distances to one decimal, durations in "
                    "minutes. Short paragraphs or a short numbered list; no headings, no tables.",
        expected_output="A concise plain-text answer grounded in tool output, with vessel ids, HH:MM times and rounded numbers.",
        agent=assistant,
    )
    return Crew(agents=[assistant], tasks=[task], process=Process.sequential,
                max_rpm=settings.GEMINI_MAX_RPM, verbose=False)


def run_with_fallback(build_crew: Callable[[object], object]) -> AgentResult:
    """Run the crew on each configured provider in order until one succeeds."""
    providers = configured_providers()
    if not providers:
        raise LLMNotConfiguredError("No LLM provider key is set (GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY).")
    failures: List[str] = []
    for spec in providers:
        try:
            result = build_crew(build_llm_for(spec)).kickoff()
            return AgentResult(text=str(result.raw), provider=spec.name, model=spec.model)
        except Exception as exc:  # provider errors come in many classes; try the next provider
            logger.warning("LLM provider %s failed: %s", spec.name, exc)
            failures.append(f"{spec.name} ({spec.model}): {str(exc)[:300]}")
    raise AgentRunError("All LLM providers failed. " + " | ".join(failures))


def investigate_vessel(vessel_id: int) -> AgentResult:
    tools, session = _session_tools()
    try:
        return run_with_fallback(lambda llm: build_surveillance_crew(vessel_id, llm=llm, tools=tools))
    finally:
        session.close()


def ask_maritime_ai(question: str) -> AgentResult:
    tools, session = _session_tools()
    try:
        return run_with_fallback(lambda llm: build_assistant_crew(question, llm=llm, tools=tools))
    finally:
        session.close()
