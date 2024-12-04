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

# Debug
VERBOSE = False
VERBOSE_DIR = "debug"
SHOW_METRICS = True
DEBUGGER = False
