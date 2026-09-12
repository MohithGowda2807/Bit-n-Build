from pathlib import Path

from app.config import Settings


def test_env_file_is_anchored_to_the_backend_directory_not_the_cwd():
    env_file = Path(Settings.model_config["env_file"])
    assert env_file.is_absolute()
    assert env_file == Path(__file__).resolve().parents[2] / ".env"
