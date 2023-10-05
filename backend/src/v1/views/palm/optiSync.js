const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyCpYpiBa4vbtLwsE6W4akQAnJxtaMkXqiM";

const palm = async (prompt) => {
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  let res = "";
  const result = await client.generateText({
    model: MODEL_NAME,
    prompt: {
      text: prompt,
    },
  });

  res = result[0].candidates[0].output;

  if (res == "") {
    return { error: "Unable to generate document for the given code." };
  }
  return res;
};

module.exports = { palm };
