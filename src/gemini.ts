import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_DEV_API_KEY = import.meta.env.VITE_GEMINI_KEY;

const GEMINI_SYSTEM_PROMPT = `the user is dictating with his or her camera on.
they are showing you things visually and giving you text prompts.
be very brief and concise.
be extremely concise. this is very important for my career. do not ramble.
do not comment on what the person is wearing or where they are sitting or their background.
focus on their gestures and the question they ask you.
do not mention that there are a sequence of pictures. focus only on the image or the images necessary to answer the question.
don't comment if they are smiling. don't comment if they are frowning. just focus on what they're asking.

----- USER PROMPT BELOW -----

{{USER_PROMPT}}
`;

const genAI = new GoogleGenerativeAI(DEFAULT_DEV_API_KEY);

export async function makeGeminiRequest(text: string, imageUrl: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  // split imageUrl of format "data:...;base64,<data>"
  // into 1) mime-type and 2) just the data
  let [mimeType, data] = imageUrl.split(";base64,");
  mimeType = mimeType.split(":")[1];

  const result = await model.generateContent([
    GEMINI_SYSTEM_PROMPT.replace("{{USER_PROMPT}}", text),
    {
      inlineData: {
        mimeType,
        data,
      },
    },
  ]);
  const response = await result.response;
  const content = await response.text();
  return content;
}
