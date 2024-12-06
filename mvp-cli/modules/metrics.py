"""Module for displaying performance metrics of the code."""
from typing import Dict, Optional
import time
from modules.formatting import BOLD_STYLE, NORMAL_STYLE, DIM_STYLE, CARET
import modules.config as config

# Maps names to their start times
_metrics_start_map: Dict[str, float] = dict()


def start(name: str, message: str):
  """
  Starts a metric, printing out the message indicating that it was started.

  Params:
    `name`: the name of the metric to start
    `message`: the message to print out after starting the metric
  """
  if not config.debug_show_metrics:
    return

  print(f"\n{CARET} {NORMAL_STYLE}{message}...", end='', flush=True)

  _metrics_start_map[name] = time.time()


def end(name: str, suffix: Optional[str] = None):
  """
  Ends a metric, printing out "done!" and the time the metric took to complete.

  Params:
    `name`: the name of the metric to end
    `suffix`: an optional suffix string to print out
  """
  if not config.debug_show_metrics:
    return

  end_time = time.time()
  start_time = _metrics_start_map.get(name, None)

  if start_time is None:
    raise f"Error: metric '{name}' was never started"

  del _metrics_start_map[name]

  total_time = round(end_time - start_time, 4)
  suffix_str = f"{NORMAL_STYLE}({suffix})" if suffix is not None else ""

  print(f" {BOLD_STYLE}done! {suffix_str} {DIM_STYLE}({total_time}s)\n", flush=True)
