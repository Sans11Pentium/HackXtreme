const bcrypt = require('bcryptjs');

/**
  * @desc hash user password at the time of register using bcrypt
  * @param  string $password - user's password
  * @return returns hashed password string
*/
const encrypt = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    return hashedpassword;
}

module.exports = encrypt;
