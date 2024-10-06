"""Module for initialization logic."""
from pathlib import Path
import modules.config as config


def setup_dirs():
  Path(config.VERBOSE_DIR).mkdir(parents=True, exist_ok=True)
  Path(config.DATA_DIR).mkdir(parents=True, exist_ok=True)
