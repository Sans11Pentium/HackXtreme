const User = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @desc verify if the user exists and login credentials.
 *       Also generates signed JWT login.
 * @param  string $request - route request
 *         string $response - route response
 * @return returns JWT token
 */
const login = async (request) => {
  const { email, password } = request.body;

  let user = await User.findOne({ email }).select("password");
  if (!user) {
    const error = { message: "You have entered an invalid email or password" };
    return { error };
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    const error = {
      message: "You have entered an invalid email or password",
    };
    return { error };
  }

  //? Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const userData = await User.findOne({ email }).select({
    email: 1,
  });

  return { userData, token };
};

module.exports = login;
