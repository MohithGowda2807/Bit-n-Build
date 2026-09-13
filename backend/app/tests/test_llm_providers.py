import pytest

from app.agents import crew
from app.agents.crew import AgentRunError
from app.agents.providers import configured_providers, provider_catalogue
from app.config import settings


@pytest.fixture
def keys(monkeypatch):
    def _set(gemini="", groq="", openrouter="", order="gemini,groq,openrouter"):
        monkeypatch.setattr(settings, "GEMINI_API_KEY", gemini)
        monkeypatch.setattr(settings, "GROQ_API_KEY", groq)
        monkeypatch.setattr(settings, "OPENROUTER_API_KEY", openrouter)
        monkeypatch.setattr(settings, "LLM_PROVIDER_ORDER", order)
    return _set


def test_provider_order_follows_settings_and_skips_missing_keys(keys):
    keys(gemini="g", groq="", openrouter="o")
    assert [p.name for p in configured_providers()] == ["gemini", "openrouter"]
    keys(gemini="g", groq="q", openrouter="o", order="groq,gemini")
    assert [p.name for p in configured_providers()] == ["groq", "gemini"]


def test_catalogue_lists_all_three_with_models_and_flags(keys):
    keys(groq="q")
    rows = {p["name"]: p for p in provider_catalogue()}
    assert set(rows) == {"gemini", "groq", "openrouter"}
    assert rows["groq"]["configured"] is True and rows["gemini"]["configured"] is False
    assert rows["groq"]["model"] == settings.GROQ_MODEL


def test_falls_back_to_next_provider_when_first_fails(keys, monkeypatch):
    keys(gemini="g", groq="q")
    used = []

    def fake_build_llm(spec):
        return f"llm:{spec.name}"

    class Crew:
        def __init__(self, llm):
            self.llm = llm

        def kickoff(self):
            used.append(self.llm)
            if self.llm == "llm:gemini":
                raise RuntimeError("503 UNAVAILABLE high demand")
            return type("R", (), {"raw": "from groq"})()

    monkeypatch.setattr(crew, "build_llm_for", fake_build_llm)
    result = crew.run_with_fallback(lambda llm: Crew(llm))
    assert result.text == "from groq" and result.provider == "groq"
    assert used == ["llm:gemini", "llm:groq"]


def test_all_providers_failing_reports_each_one(keys, monkeypatch):
    keys(gemini="g", openrouter="o")
    monkeypatch.setattr(crew, "build_llm_for", lambda spec: spec.name)

    class Crew:
        def __init__(self, llm):
            self.llm = llm

        def kickoff(self):
            raise RuntimeError(f"{self.llm} exploded")

    with pytest.raises(AgentRunError) as err:
        crew.run_with_fallback(lambda llm: Crew(llm))
    assert "gemini" in str(err.value) and "openrouter" in str(err.value)


def test_no_providers_configured_raises_not_configured(keys):
    keys()
    with pytest.raises(crew.LLMNotConfiguredError):
        crew.run_with_fallback(lambda llm: None)


def test_groq_llm_keeps_the_full_model_id(monkeypatch):
    """Groq's ids carry a vendor prefix (openai/gpt-oss-120b). CrewAI strips one 'openai/' as its routing
    prefix, so the LLM must be built with the full id behind it or Groq answers 404 model_not_found."""
    from app.agents.providers import ProviderSpec, build_llm_for
    llm = build_llm_for(ProviderSpec("groq", "openai/gpt-oss-120b", "key"))
    assert llm.model == "openai/gpt-oss-120b"  # what is sent to Groq after CrewAI removes its routing prefix


def test_an_explicit_order_overrides_the_default_chain(keys):
    """The investigation crew needs more tokens per minute than Groq's free tier allows, so it runs Gemini first
    while the single-agent assistant keeps Groq first."""
    keys(gemini="g", groq="q", openrouter="o", order="groq,gemini,openrouter")
    assert [p.name for p in configured_providers(order="gemini,groq")] == ["gemini", "groq"]
    assert settings.CREW_PROVIDER_ORDER.split(",")[0] == "gemini"
