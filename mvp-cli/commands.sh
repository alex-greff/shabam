python main.py add 1 audio/self_destruct.wav --output-debug-files
python main.py add 2 audio/i_kissed.wav --output-debug-files

python main.py search audio/self_destruct_clip_1.wav --use-cache
python main.py search audio/self_destruct_clip_2.wav --use-cache

python main.py search audio/i_kissed_clip_1.wav --use-cache
python main.py search audio/i_kissed_clip_2.wav --use-cache

python main.py clear-cache --show-debug --no-track
python main.py clear-cache --show-debug --no-clip
