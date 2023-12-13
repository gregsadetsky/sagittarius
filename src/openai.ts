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

export async function makeOpenAIRequest(
  text: string,
  imageUrl: string,
  apiKey = DEFAULT_DEV_API_KEY
) {
  const debugImage = new Image();
  debugImage.src = imageUrl;
  document.querySelector(
    "#debugImages"
  )!.innerHTML = `<div style='font-size:20px'>${text}</div>`;
  document.querySelector("#debugImages")!.appendChild(debugImage);

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

  const body = {
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    temperature: 0,
    messages,
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
}
