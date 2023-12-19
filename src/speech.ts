import { getChosenLanguage } from "./main";

export class Speech {
  foundGoogleVoice: SpeechSynthesisVoice | null = null;
  unspokenStreamWords: string[] = [];
  speakingStream: boolean = false;

  constructor() {
    this.onVoicesChangeHandler = this.onVoicesChangeHandler.bind(this);
    this.onVoicesChangeHandler();
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      this.onVoicesChangeHandler
    );
  }

  onVoicesChangeHandler() {
    const foundVoices = window.speechSynthesis
      .getVoices()
      .filter((v) => v.name.indexOf("Google US English") !== -1);

    if (foundVoices.length > 0) {
      // this.foundGoogleVoice = foundVoices[0];
    }
  }

  speak(message: string) {
    return new Promise<void>((resolve) => {
      let utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = getChosenLanguage();
      if (this.foundGoogleVoice) {
        utterance.voice = this.foundGoogleVoice;
      }
      utterance.onend = () => {
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  }

  startStream() {
    this.unspokenStreamWords = [];
  }
  addToStream(message: string) {
    this.unspokenStreamWords.push(message);
    this.speakStream();
  }
  speakStream() {
    if (this.unspokenStreamWords.length === 0) {
      return;
    }
    if (this.speakingStream) {
      return;
    }

    this.speakingStream = true;
    const message = this.unspokenStreamWords.join(" ");
    this.unspokenStreamWords = [];
    this.speak(message).then(() => {
      this.speakingStream = false;
      this.speakStream();
    });
  }
  speakStreamIsDone() {
    return this.unspokenStreamWords.length === 0 && !this.speakingStream;
  }
}
