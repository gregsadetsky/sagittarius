declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

let recognition = null;
let lastAddedFinalResultIndex = -1;

export function startDictation(
  receivedEventsCallback: (message: string) => void
) {
  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.onerror = (error: any) => {
    console.log("error", error);
  };

  recognition.onresult = (event: any) => {
    const newMessages: string[] = [];
    Array.from(event.results).forEach((result, resultIndex) => {
      if (result.isFinal && resultIndex > lastAddedFinalResultIndex) {
        lastAddedFinalResultIndex = resultIndex;
        newMessages.push(result[0].transcript);
      }
    });

    if (newMessages.length > 0) {
      const trancription = newMessages.join(" ").trim();
      receivedEventsCallback(trancription);
    }
  };

  recognition.start();
}

export function restartDictation() {
  lastAddedFinalResultIndex = -1;
  recognition && recognition.start();
}

export function stopDictation() {
  recognition && recognition.stop();
}
