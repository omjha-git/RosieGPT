import "dotenv/config";

const getOpenAIResponse = async (message) => {

  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },

    body: JSON.stringify({
      model: "meta-llama/llama-3.3-8b-instruct:free",

      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      options
    );

   const data = await response.json();

if (!response.ok) {
  console.error("OpenRouter Error:", data);
  throw new Error(data.error?.message || "OpenRouter request failed");
}

return data.choices[0].message.content;

  } catch (err) {

    console.log(err);

  }
};

export default getOpenAIResponse;