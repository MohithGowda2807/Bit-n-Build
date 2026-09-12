from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.agents.crew import AgentRunError, LLMNotConfiguredError, ask_maritime_ai, llm_configured
from app.agents.crew_tools import TOOL_NAMES
from app.agents.providers import provider_catalogue
from app.config import settings

router = APIRouter(prefix="/api/v1/assistant", tags=["Assistant"])


class AskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=1000)


class AskResponse(BaseModel):
    question: str
    answer: str
    provider: str
    model: str


def agent_failed(exc: Exception) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail={"code": "AGENT_RUN_FAILED", "message": str(exc)[:500]},
    )


def llm_unavailable() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={"code": "LLM_NOT_CONFIGURED", "message": "No LLM provider is configured. Set GEMINI_API_KEY, GROQ_API_KEY or OPENROUTER_API_KEY in backend/.env."},
    )


@router.get("/status")
def assistant_status():
    return {"llm_configured": llm_configured(), "model": settings.GEMINI_MODEL,
            "providers": provider_catalogue(), "tools": TOOL_NAMES}


@router.post("/ask", response_model=AskResponse)
def ask(payload: AskRequest):
    if not llm_configured():
        raise llm_unavailable()
    try:
        result = ask_maritime_ai(payload.question)
    except LLMNotConfiguredError:
        raise llm_unavailable()
    except AgentRunError as exc:
        raise agent_failed(exc)
    return AskResponse(question=payload.question, answer=result.text, provider=result.provider, model=result.model)
