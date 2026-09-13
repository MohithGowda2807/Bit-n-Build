"""LLM provider chain: Gemini first, then Groq, then OpenRouter.

A provider takes part only when its API key is set. Models are settings so the
team can move to newer free models without a code change.
"""
import os
from dataclasses import dataclass
from typing import Optional, Dict, List

from app.config import settings

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


@dataclass(frozen=True)
class ProviderSpec:
    name: str
    model: str
    api_key: str


def _specs() -> Dict[str, ProviderSpec]:
    return {
        "gemini": ProviderSpec("gemini", settings.GEMINI_MODEL, settings.GEMINI_API_KEY),
        "groq": ProviderSpec("groq", settings.GROQ_MODEL, settings.GROQ_API_KEY),
        "openrouter": ProviderSpec("openrouter", settings.OPENROUTER_MODEL, settings.OPENROUTER_API_KEY),
    }


def _order(order: Optional[str] = None) -> List[str]:
    return [name.strip().lower() for name in (order or settings.LLM_PROVIDER_ORDER).split(",") if name.strip()]


def configured_providers(order: Optional[str] = None) -> List[ProviderSpec]:
    """Providers with a key, in `order` (a comma list; defaults to LLM_PROVIDER_ORDER)."""
    specs = _specs()
    return [specs[name] for name in _order(order) if name in specs and specs[name].api_key]


def provider_catalogue() -> List[Dict]:
    specs = _specs()
    return [{"name": name, "model": specs[name].model, "configured": bool(specs[name].api_key)}
            for name in _order() if name in specs]


def build_llm_for(spec: ProviderSpec):
    """Construct a CrewAI LLM for one provider. Imported lazily: crewai takes seconds to import."""
    from crewai import LLM

    if spec.name == "gemini":
        os.environ["GEMINI_API_KEY"] = spec.api_key
        return LLM(model=spec.model, temperature=0.2)
    if spec.name == "groq":
        # Groq speaks the OpenAI protocol; CrewAI's native OpenAI provider handles tool calling. It strips the
        # leading "openai/" as a routing prefix, so the full Groq id (itself "openai/gpt-oss-120b") stays behind it.
        return LLM(model=f"openai/{spec.model}", api_key=spec.api_key, base_url=GROQ_BASE_URL, temperature=0.2)
    if spec.name == "openrouter":
        os.environ["OPENROUTER_API_KEY"] = spec.api_key
        return LLM(model=f"openrouter/{spec.model}", api_key=spec.api_key, temperature=0.2)
    raise ValueError(f"Unknown LLM provider '{spec.name}'")
