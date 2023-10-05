const { palm } = require("./optiSync");

const optimiseCode = async (request, response) => {
  try {
    const { code } = request.body;

    const prompt =
      "Optimize the following code snippet for performance and readability:" +
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
