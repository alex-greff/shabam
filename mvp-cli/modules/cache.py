"""Module for caching computed numpy data."""
from typing import Any, Optional
import numpy as np
import modules.config as config


def save(name: str, data: Any):
  """
  Saves an item to the cache.

  Params:
    name: the name of the cache item
    data: the data to save
  """
  cache_filepath = f"{config.DATA_DIR}/{name}.npy"
  np.save(cache_filepath, data)


def load(name: str) -> Optional[Any]:
  """
  Loads an item from the cache, None is returned if no item is found.

  Params:
    name: the name of the cache item
  """
  cache_filepath = f"{config.DATA_DIR}/{name}.npy"
  try:
    return np.load(cache_filepath)
  # pylint: disable-next=broad-exception-caught
  except Exception:
    return None
