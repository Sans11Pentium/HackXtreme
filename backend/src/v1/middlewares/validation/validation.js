const { registerValidation } = require("../../utils/validation/validateUsers");

/**
  * @desc validate new user data middleware
  * @param  string $request - route request
            string $response - route response
            string $next - next()
*/
const validateUsers = (request, response, next) => {
  const { error } = registerValidation(request.body);

  if (error) {
    response.status(400).send(error.details[0].message);
  } else {
    next();
  }
};

module.exports = { validateUsers };
