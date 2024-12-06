"""Module for initialization logic."""
from pathlib import Path
import modules.config as config


def setup_dirs():
  """
  Ensures the required directories are setup.
  """
  Path(config.DEBUG_DIR).mkdir(parents=True, exist_ok=True)
  Path(f"{config.DEBUG_DIR}/track").mkdir(parents=True, exist_ok=True)
  Path(f"{config.DEBUG_DIR}/clip").mkdir(parents=True, exist_ok=True)

  Path(config.DATA_DIR).mkdir(parents=True, exist_ok=True)
  Path(f"{config.DATA_DIR}/track").mkdir(parents=True, exist_ok=True)
  Path(f"{config.DATA_DIR}/clip").mkdir(parents=True, exist_ok=True)
