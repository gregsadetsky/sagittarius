import OpenAI from "openai";

import { stopDictation } from "./dictation";
import { updatePromptOutput } from "./main";
import { type Speech } from "./speech";

const DEFAULT_DEV_API_KEY = import.meta.env.VITE_OPENAI_KEY;

const OPEN_AI_SYSTEM_PROMPT = `the user is dictating with his or her camera on.
they are showing you things visually and giving you text prompts.
be very brief and concise.
be extremely concise. this is very important for my career. do not ramble.
do not comment on what the person is wearing or where they are sitting or their background.
focus on their gestures and the question they ask you.
do not mention that there are a sequence of pictures. focus only on the image or the images necessary to answer the question.
don't comment if they are smiling. don't comment if they are frowning. just focus on what they're asking.
`;

function outputDots(newMessage: string) {
  const promptOutput = document.getElementById("promptOutput");
  if (promptOutput) {
    promptOutput.innerHTML += newMessage;
    promptOutput.scrollTop = promptOutput.scrollHeight; // Auto-scroll to bottom
  }
}

export async function makeOpenAIRequest(
  text: string,
  imageUrl: string,
  apiKey = DEFAULT_DEV_API_KEY,
  speech: Speech
) {
  const debugImage = new Image();
  debugImage.src = imageUrl;
  document.querySelector(
    "#debugImages"
  )!.innerHTML = `<div style='font-size:20px'>${text}</div>`;
  document.querySelector("#debugImages")!.appendChild(debugImage);

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const messages = [
    {
      role: "system",
      content: OPEN_AI_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text,
        },
        {
          type: "image",
          image_url: {
            url: imageUrl,
          },
        },
      ],
    },
  ];

  const stream = await openai.chat.completions.create({
    messages,
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    temperature: 0,
    stream: true,
  });

  // the dictation is catching its own speech!!!!! stop dictation before speaking.
  stopDictation();
  speech.startStream();

  let potentiallyIncompleteWord = "";

  for await (const chunk of stream) {
    const message = chunk.choices[0]?.delta?.content;
    if (!message) {
      continue;
    }

    updatePromptOutput(message, true);

    if (message[0] !== " ") {
      // this is potentially the continuation of an incomplete word i.e. 'Quant' followed by 'um'
      potentiallyIncompleteWord += message;
    } else {
      // this is a new word
      speech.addToStream(potentiallyIncompleteWord + message);
      potentiallyIncompleteWord = "";
    }
  }

  if (potentiallyIncompleteWord) {
    speech.addToStream(potentiallyIncompleteWord);
  }

  // print a new line
  updatePromptOutput("");

  // wait until the speech is done
  while (!speech.speakStreamIsDone()) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
