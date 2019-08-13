const AudioRecorder = {
    async create() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () => {
            return new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav; codecs=MS_PCM' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    resolve({ audioBlob, audioUrl, audio });
                });

                mediaRecorder.stop();
            });
        };

        const pause = () => mediaRecorder.pause();

        const resume = () => mediaRecorder.resume();

        const getState = () => mediaRecorder.state;

        const isInactive = () => getState() === "inactive";

        const isRecording = () => getState() === "recording";

        const isPaused = () => getState() === "paused";

        return {
            start,
            stop,
            pause,
            resume,
            getState,
            isInactive,
            isRecording,
            isPaused,
        };
    }
}

export default AudioRecorder;
