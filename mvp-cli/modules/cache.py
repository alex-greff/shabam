"""Module for caching computed numpy data."""
import os
from typing import Any, Literal, Optional, Union
import pickle
import glob
from pathlib import Path
import numpy as np
from modules import config
from modules.formatting import WARNING_STYLE, NORMAL_STYLE, BOLD_STYLE, CARET

CacheCategory = Union[Literal["track"], Literal["clip"]]


def save(
    name: str,
    category: CacheCategory,
    data: Any,
    is_numpy=True
):
  """
  Saves an item to the cache.

  Params:
    `name`: the name of the cache item
    `category`: the category of data being cached
    `data`: the data to save
    `is_numpy`: indicates of the data is a numpy object (default: `True`)
  """
  if is_numpy:
    cache_filepath = f"{config.DATA_DIR}/{category}/{name}.npy"
    np.save(cache_filepath, data)
  else:
    # Ensure cache file exists
    cache_filepath = f"{config.DATA_DIR}/{category}/{name}.pkl"
    if not os.path.exists(os.path.dirname(cache_filepath)):
      os.mkdir(os.path.dirname(cache_filepath))

    with open(cache_filepath, "wb") as f:
      pickle.dump(data, f)


def load(
    name: str,
    category: CacheCategory,
    is_numpy=True
) -> Optional[Any]:
  """
  Loads an item from the cache, `None` is returned if no item is found.

  Params:
    `name`: the name of the cache item
    `category`: the category of data that is being loaded
    `is_numpy`: indicates if the intended data to load is a numpy object (default: `True`)
  Returns:
    The cached data or `None` if nothing is found
  """
  try:
    if is_numpy:
      cache_filepath = f"{config.DATA_DIR}/{category}/{name}.npy"
      return np.load(cache_filepath)
    else:
      cache_filepath = f"{config.DATA_DIR}/{category}/{name}.pkl"
      if not os.path.exists(os.path.dirname(cache_filepath)):
        return None

      with open(cache_filepath, "rb") as f:
        return pickle.load(f)
  # pylint: disable-next=broad-exception-caught
  except Exception as e:
    print(f"{WARNING_STYLE}Warning: failed to load from cache key '{name}' {e}")
    return None


def clear(
    name: str,
    category: CacheCategory,
    is_numpy=True,
    show_debug=False
):
  """
  Clears the given cache item.

  Params:
    `name`: the name of the cache item to clear. Can be a glob pattern
    `category`: the category of cache item that is being cleared
    `is_numpy`: indicates if the intended data to clear is a numpy object (default: `True`)
    `show_debug`: show the debug logs for each cache item deleted (default: `False`)
  """
  suffix = ".npy" if is_numpy else ".pkl"
  cache_files = glob.glob(
      f"{config.DATA_DIR}/{category}/{name}{suffix}")

  for cache_filepath in cache_files:
    if show_debug:
      cache_name = Path(cache_filepath).stem
      print(
          f"{CARET} {NORMAL_STYLE}Clearing {category} cache item: {BOLD_STYLE}{cache_name}")
    os.unlink(Path(cache_filepath))
