python main.py add 1 audio/self_destruct.wav
python main.py add 2 audio/i_kissed.wav

python main.py add 123 audio/self_destruct_clip_1.wav --use-cache
python main.py add 456 audio/self_destruct_clip_2.wav --use-cache

python main.py search audio/self_destruct_clip_1.wav --use-cache
python main.py search audio/self_destruct_clip_2.wav --use-cache

python main.py search audio/i_kissed_clip_1.wav --use-cache
python main.py search audio/i_kissed_clip_2.wav --use-cache