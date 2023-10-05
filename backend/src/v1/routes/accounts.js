const router = require("express").Router();
const register = require("../views/accounts/signUp");
const login = require("../views/accounts/signIn");
const { validateUsers } = require("../middlewares/validation/validation");

/**
  * @route Register route
  * @desc register a new user
  * @middleware validate user data
  * @param  string $request - route request
            string $response - route response
  * @return returns response
*/
router.post("/register", validateUsers, async (request, response) => {
  try {
    const { data, error } = await register(request);
    if (error) {
      return response.status(400).send(error);
    } else {
      response.status(201).send({ message: data });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Internal server error" });
  }
});

/**
  * @route Login route
  * @desc login existing user and generates JWT token
  * @middleware validate login credentials
  * @param  string $request - route request
            string $response - route response
  * @return returns response
*/
router.post("/login", async (request, response) => {
  try {
    //? Getting the JWT token
    const { userData, token, error } = await login(request);
    if (error) {
      return response.status(400).send(error);
    } else {
      response.status(200).send({ userData, token });
    }
  } catch (error) {
    response.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
