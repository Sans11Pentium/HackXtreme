const router = require("express").Router();
const permission = require("../middlewares/permission/permission");
const generateDocumentation = require("../views/palm/generateDocumentation");
const optimiseCode = require("../views/palm/optimiseCode");

/**
  * @route generateDocstring route
  * @desc Makes a post request to PaLM API. Returns an array of the responses 
        * or `undefined` if something went wrong.
  * @param  string $request - route request
            string $response - route response
  * @return returns response
*/
router.post("/generateDocstring", permission, async (request, response) => {
  try {
    const result = await generateDocumentation(request);

    if (result.error) {
      return response.status(400).send({ message: error });
    } else {
      response.status(200).send(result);
    }
  } catch (error) {
    response.status(500).send({ message: "Internal server error" });
  }
});

/**
 * @route optimiseCode route
 * @desc Makes a POST request to optimize code using the PaLM API.
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @returns {Object} Returns the optimized code or an error message.
 */
router.post("/optimiseCode", permission, async (request, response) => {
  try {
    const result = await optimiseCode(request);

    if (result.error) {
      return response.status(400).send({ message: error });
    } else {
      response.status(200).send(result);
    }
  } catch (error) {
    response.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
