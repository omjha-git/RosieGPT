import "dotenv/config";

const getOpenAIResponse = async (message) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "HTTP-Referer": "https://rosie-gpt.vercel.app",
      "X-Title": "RosieGPT",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();

  console.log("OpenRouter response:", JSON.stringify(data));

  if (!response.ok) {
    throw new Error(data.error?.message || "OpenRouter failed");
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("No reply content received from OpenRouter");
  }

  return reply;
};

export default getOpenAIResponse;