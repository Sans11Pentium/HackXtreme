const { palm } = require("./optiSync");

const optimiseCode = async (request, response) => {
  try {
    const { code } = request.body;

    const prompt =
      "Please optimize the given code snippet for both performance and readability. Provide the optimized code without any additional explanation or comments. Without the language identifier and backticks " +
      code;
    // get optimised Code from the PaLM API.
    const result = await palm(prompt);

    if (result.error) {
      const error = result;
      return error;
    }
    return { optimisedCode: result };
  } catch (error) {
    response.status(500).send("Internal server error.");
  }
};

module.exports = optimiseCode;
