export class AudioRecorder {
  private mediaRecorder: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor(mediaStream: MediaStream) {
    const mediaRecorder = new MediaRecorder(mediaStream);
    this.mediaRecorder = mediaRecorder;

    mediaRecorder.addEventListener("dataavailable", (event) => {
      this.audioChunks.push(event.data);
    });
  }

  public stop() {
    return new Promise<Blob>((resolve) => {
      this.mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: "audio/wav; codecs=MS_PCM",
        });

        resolve(audioBlob);
      });

      this.mediaRecorder.stop();
    });
  }

  public start() {
    this.mediaRecorder.start();
  }

  public pause() {
    this.mediaRecorder.pause();
  }

  public resume() {
    this.mediaRecorder.resume();
  }

  get state() {
    return this.mediaRecorder.state;
  }

  get isInactive() {
    return this.state === "inactive";
  }

  get isRecording() {
    return this.state === "recording";
  }

  get isPaused() {
    return this.state === "paused";
  }
}

const AudioRecorderFactory = {
  async create() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioRecorder = new AudioRecorder(stream);
    return audioRecorder;
  },
};

export default AudioRecorderFactory;
