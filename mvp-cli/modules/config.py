"""Module for storing global level configuration."""

# Output
DATA_DIR = "data"
CACHE_DIR = f"{DATA_DIR}/cache"

# --- Preprocessing ---

DOWNSAMPLE_FACTOR = 4
FFT_SIZE = 4096  # 2**12

# --- Partition Ranges ---

# The number of partitions used
NUM_PARTITIONS = 30

# Tension of the partition range generation curve
# https://www.desmos.com/calculator/ugsemeqxan
# range: 1 < partition_tension < infinity
# lower = less "tense", less partitions distributed lower in the frequency spectrum
# higher = more "tense", more partitions distributed higher in the frequency spectrum
PARTITION_TENSION = 150

# --- Fingerprint Generation ---

SLIDER_SIZE_MS = 7  # milliseconds
SLIDER_SIZE_SAMP = 21
SLIDER_STEP_MS = 100  # milliseconds
SLIDER_STEP_SAMP = 1

# TODO: remove
# The width of the rolling slider, used when slicing the spectrogram into windows
# and computing the slider width boundaries
# NOTE: should always be an odd number due to the window function
# lower = less frequency detail, higher = more frequency detail
# SLIDER_WIDTH = 21
# The height of the rolling slider, used when computing the slider height boundaries
# NOTE: set to 0 or less to use the whole height
# lower = more localized analysis, higher = less localized analysis
SLIDER_HEIGHT = 3

# TODO: remove
# The step amount of the slider
# SLIDER_STEP < SLIDER_WIDTH: slider ranges will overlap by SLIDER_WIDTH - SLIDER_STEP
#   windows (this is is recommended to avoid spectral leakage)
# SLIDER_STEP = SLIDER_WIDTH: no overlap and no gap between each slider
# SLIDER_STEP > SLIDER_WIDTH: slider ranges will have a gap of SLIDER_WIDTH - SLIDER_STEP
#   windows (this is not recommended at all and will cause frequencies to be ignored)
# SLIDER_STEP_MS = 10

# The config for the get_window's window parameter
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.windows.get_window.html#scipy.signal.windows.get_window
# Commented out below are some common ones to use
# WINDOW_FUNCTION_CONFIG = "boxcar"  # square window, effectively no window
# WINDOW_FUNCTION_CONFIG = "hamming"
# WINDOW_FUNCTION_CONFIG = "hann"
WINDOW_FUNCTION_CONFIG = "blackmanharris"  # recommended, has good freq response

# Multiplier put on the standard deviation value when checking threshold value
# lower = less sensitive, higher = more sensitive
STANDARD_DEVIATION_MULTIPLIER = 4.5

# ---- Record Generation ---

TARGET_ZONE_SIZE = 4
ANCHOR_OFFSET = 3

# --- Result searching ---

# The tolerance coefficient used when determining which potential tracks to keep
# based off how many target zones it matched to the clip
# Calculation: >= TZ_MATCH_TOLERANCE_COEFFICIENT * audio_clip_num_tz
# 0 = keep any track that has at least one matched target zone with the audio clip
#     (effectively disables the filtering step)
# 1 = only keep matched tracks that have at least the total number of
#     target zones in the audio clip
# lower = filter less tracks, higher = filter out more tracks
TZ_MATCH_TOLERANCE_COEFFICIENT = 0

# The number of possible deltas used before exiting the time coherence filtering
# step out early to avoid computing an absurd number of possible deltas
POSSIBLE_DELTA_COMPUTE_THRESHOLD = 1000

# The tolerance coefficient used when determining which potential track to keep
# based off how many records are time coherent with the clip.
# Calculation: >= TC_MATCH_TOLERANCE_COEFFICIENT * audio_clip_num_records
# NOTE: we normally want to keep this pretty low
# 0 = keep any track that has at least one time coherent record
#     (effectively disables the filtering step)
# 1 = only keep matched tracks that have the total number of records in the clip
#     time coherent
# lower = filter less tracks, higher = filter out more tracks
TC_MATCH_TOLERANCE_COEFFICIENT = 0

# --- Storage ---

# The storage engine to use
# Options: "pickle" or "sqlite"
STORAGE_ENGINE = "pickle"

# --- Debug ---

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
