import "dotenv/config";

const getOpenAIResponse = async (message) => {

  const options = {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },

    body: JSON.stringify({
      model: "openrouter/free",

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

    return data.choices[0].message.content;

  } catch (err) {

    console.log(err);

  }
};

export default getOpenAIResponse;