const OpenAI = require("openai");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const config = require("../../config");

async function generateBidMessage(projectData) {
  const { apiKey } = config.chatgpt;
  const { owner_name, username, skills, projectName } = projectData;
  console.log(projectData);

  const prompt = `Client name is ${owner_name} and my name is ${username}.Generate a professional and enthusiastic message for bidding on a project. The message should indicate interest in the ${projectName} project  and highlight relevant skills: ${skills}`;

  const data = {
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that helps generate professional messages for freelancers.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Extract and return the generated message
      const generatedMessage = result.choices[0].message.content;
      console.log("Generated Message:", generatedMessage);
      return {
        success: true,
        data: generatedMessage,
      };
    } else {
      console.error("Error:", result);
      return {
        success: false,
        data: result.error.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error, // Return the error message
    };
  }
}

module.exports = {
  generateBidMessage,
};
