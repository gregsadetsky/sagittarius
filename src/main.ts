import { makeOpenAIRequest } from "./openai";
import { startDictation, stopDictation, restartDictation } from "./dictation";
import { startCamera, stopCamera } from "./camera";
import { scaleAndStackImagesAndGetBase64 } from "./imageStacker";
import { makeGeminiRequest } from "./gemini";

const IMAGE_STACK_SIZE = 3;

let isDictating = false;
let imageStack: HTMLImageElement[] = [];
let imageStackInterval: number | null = null;

let unsentMessages: string[] = [];
let openAiCallInTransit = false;
let newMessagesWatcherInterval: number | null = null;

function pushNewImageOnStack() {
  const canvas = document.querySelector("canvas")! as HTMLCanvasElement;
  const base64 = canvas.toDataURL("image/jpeg");
  const image = document.createElement("img");
  image.src = base64;

  imageStack.push(image);
  if (imageStack.length > IMAGE_STACK_SIZE) {
    imageStack.shift();
  }
}

function dictationEventHandler(message?: string) {
  if (message) {
    unsentMessages.push(message);
    updatePromptOutput(message);
  }

  if (!openAiCallInTransit) {
    openAiCallInTransit = true;
    const base64 = scaleAndStackImagesAndGetBase64(imageStack);
    const textPrompt = unsentMessages.join(" ");
    unsentMessages = [];

    let aiFunction = null;
    aiFunction =
      (document.querySelector('.toggle-slider')?.getAttribute('data-position') === "left")
        ? makeOpenAIRequest
        : makeGeminiRequest;

    aiFunction(textPrompt, base64).then((result) => {
      console.log("result", result);

      // the dictation is catching its own speech!!!!! stop dictation before speaking.
      stopDictation();
      let utterance = new SpeechSynthesisUtterance(result);
      updatePromptOutput(utterance.text);
      speechSynthesis.speak(utterance);
      utterance.onend = () => {
        restartDictation();
        openAiCallInTransit = false;
      };
    });
  }
}

export function updatePromptOutput(newMessage: string) {
  const promptOutput = document.getElementById('promptOutput');
  if (promptOutput) {
    promptOutput.innerHTML += newMessage + '<br>';
    promptOutput.scrollTop = promptOutput.scrollHeight; // Auto-scroll to bottom
  }
}

// after AI call in transit is done, if we have
// some messages in the unsent queue, we should make another openai call.
function newMessagesWatcher() {
  if (!openAiCallInTransit && unsentMessages.length > 0) {
    dictationEventHandler();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  document.querySelector("#startButton")!.addEventListener("click", function () {
    isDictating = !isDictating;

    if (isDictating) {
      startCamera();
      startDictation(dictationEventHandler);

      imageStackInterval = window.setInterval(() => {
        pushNewImageOnStack();
      }, 800);

      newMessagesWatcherInterval = window.setInterval(() => {
        newMessagesWatcher();
      }, 100);

      document.querySelector("#startButton")!.textContent = "Stop";
    } else {
      stopCamera();
      stopDictation();

      imageStackInterval && clearInterval(imageStackInterval);
      newMessagesWatcherInterval && clearInterval(newMessagesWatcherInterval);

      document.querySelector("#startButton")!.textContent = "Start";
    }
  });
});

document.querySelector('.toggle-switch').addEventListener('click', function() {
  var slider = document.querySelector('.toggle-slider');
  if (slider.getAttribute('data-position') === 'right') {
    slider.style.left = '0px';
    slider.setAttribute('data-position', 'left');
  } else {
    slider.style.left = '40px';
    slider.setAttribute('data-position', 'right');
  }
});
