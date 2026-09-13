"""The Phase 1 debris seed feeds the cleanup planner, drift table and detail drawer; each patch needs its own mass."""
from app.data.seed_data import SEED_DEBRIS


def test_seed_debris_carry_distinct_masses_and_volumes():
    masses = [d.get("estimated_mass_kg") for d in SEED_DEBRIS]
    assert all(m is not None and m > 0 for m in masses), masses
    assert len(set(masses)) == len(masses), "every debris patch should have its own mass, not the model default"
    assert all(d.get("estimated_volume_m3", 0) > 0 for d in SEED_DEBRIS)
