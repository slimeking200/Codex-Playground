const AMBIENCE_TRACKS = [
  'https://cdn.jsdelivr.net/gh/marcinlawnik/misc-audio@main/ambient/ocean-waves.mp3',
  'https://cdn.jsdelivr.net/gh/marcinlawnik/misc-audio@main/ambient/birds.mp3'
];

export class AudioManager {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted = false;
  private currentBufferSource: AudioBufferSourceNode | null = null;

  public async initialize(): Promise<void> {
    if (this.context) {
      return;
    }
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = 0.3;
    await this.playAmbience(0);
  }

  private async playAmbience(index: number): Promise<void> {
    if (!this.context || !this.gainNode) {
      return;
    }
    const trackUrl = AMBIENCE_TRACKS[index % AMBIENCE_TRACKS.length];
    const response = await fetch(trackUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(this.gainNode);
    source.start(0);

    this.currentBufferSource = source;
  }

  public async resume(): Promise<void> {
    if (!this.context) {
      await this.initialize();
      return;
    }
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  public mute(): void {
    if (this.gainNode && !this.isMuted) {
      this.gainNode.gain.value = 0;
      this.isMuted = true;
    }
  }

  public unmute(): void {
    if (this.gainNode && this.isMuted) {
      this.gainNode.gain.value = 0.3;
      this.isMuted = false;
    }
  }

  public toggleMute(): void {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }
}
