"""Module for storing global level configuration."""

# Output
DATA_DIR = "data"

# Preprocessing
DOWNSAMPLE_FACTOR = 4
FFT_SIZE = 4096  # 2**12

# Partition ranges
NUM_PARTITIONS = 30
PARTITION_TENSION = 10

# NOTE: should always be an odd number due to the window function
SLIDER_WIDTH = 21
# NOTE: set to 0 or less to use the whole height
SLIDER_HEIGHT = -1

# The config for the get_window's window parameter
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.windows.get_window.html#scipy.signal.windows.get_window
# Commented out below are some common ones to use
# WINDOW_FUNCTION_CONFIG = "boxcar"  # square window, effectively no window
# WINDOW_FUNCTION_CONFIG = "hamming"
# WINDOW_FUNCTION_CONFIG = "hann"
WINDOW_FUNCTION_CONFIG = "blackmanharris"  # recommended, has good freq response

# Multiplier put on the standard deviation value when checking threshold value
# lower = less sensitive, higher = more sensitive
STANDARD_DEVIATION_MULTIPLIER = 3.4

TARGET_ZONE_SIZE = 4

# Debug
DEBUG_DIR = "debug"
DEBUG_TRACK_DIR = f"{DEBUG_DIR}/track"
DEBUG_CLIP_DIR = f"{DEBUG_DIR}/clip"
DEBUGGER = False

# --- Runtime set config ---
# These values can be set during runtime. These config values should only be for
# secondary functionality such as debugging and metrics.
# We use this setup to avoid parameter drilling within dependent modules
debug_output_data = False
debug_show_stats = False
debug_show_metrics = True
