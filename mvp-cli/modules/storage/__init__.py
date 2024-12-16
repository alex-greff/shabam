"""Storage index module"""
from modules.storage.storage_abc import StorageEngine
from modules.storage.pickle_storage import PickleStorageEngine
from modules import config


def get_storage_engine() -> StorageEngine:
  """
  Returns the the configured storage engine to use.
  """
  engine_type = config.STORAGE_ENGINE

  if engine_type == "pickle":
    return PickleStorageEngine()
  elif engine_type == "sqlite":
    raise NotImplementedError()
  else:
    raise f"Unknown engine type: {engine_type}"
