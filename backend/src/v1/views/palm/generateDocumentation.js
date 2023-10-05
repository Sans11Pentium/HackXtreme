const { palm } = require("./optiSync");

const generateDocumentation = async (request, response) => {
  try {
    const { code } = request.body;
    const prompt =
      "Please provide concise documentation for the following code snippet, encapsulating its purpose and functionality in no more than three lines. Avoid including any actual code in your response." +
      code;
    // get documentation from the PaLM API.
    const result = await palm(prompt);

    if (result.error) {
      const error = result;
      return error;
    }
    return { documentation: result };
  } catch (error) {
    response.status(500).send("Internal server error.");
  }
};

module.exports = generateDocumentation;
