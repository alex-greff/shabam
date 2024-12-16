# Add params:
# -c --use-cache
# -f --output-debug-files
# -s --show-debug-stats
# -m --show-debug-metrics
python main.py add 1 audio/self_destruct.wav -fsm
python main.py add 2 audio/i_kissed.wav -fsm

# Search params:
# -c --use-cache
# -f --output-debug-files
# -s --show-debug-stats
# -m --show-debug-metrics
python main.py search audio/self_destruct_clip_1.wav -fsm
python main.py search audio/self_destruct_clip_2.wav -fsm

python main.py search audio/i_kissed_clip_1.wav -fsm
python main.py search audio/i_kissed_clip_2.wav -fsm

python main.py clear-cache --show-debug --no-track
python main.py clear-cache --show-debug --no-clip
