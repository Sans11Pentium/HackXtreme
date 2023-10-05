const User = require("../../models/Users");
const encrypt = require("../../utils/encryption/encrypt");

/**
 * @desc create new user and saves to MongoDB
 * @param  string $request - route request
 * @return returns saved user data
 */
const register = async (request) => {
  let user = await User.findOne({
    $or: [
      {
        email: request.body.email,
      },
    ],
  });
  if (user) {
    if (user.email === request.body.email) {
      const error = { message: "Email already exists" };
      return { error };
    }
  } else {
    const user = new User({
      email: request.body.email,
      password: await encrypt(request.body.password),
    });
    user.save();

    data = "User Created Successfully";
    return { data };
  }
};

module.exports = register;
