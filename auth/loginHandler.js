const bcrypt = require("bcrypt");

const getUserByemail = require("../controllers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
    const user = await getUserByemail(email);
    if (!user) {
        throw { code: 404, msg: "User not found!!!" };
    }
    const userPassword = user.password;

    const result = bcrypt.compareSync(incomingPassword, userPassword);
    
    if (result) {
        return issueToken(user);
    } else {
        throw { code: 401, msg: "Invalid credentials" };
    }
};

module.exports = loginHandler;