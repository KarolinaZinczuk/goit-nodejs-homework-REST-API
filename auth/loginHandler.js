const bcrypt = require("bcrypt");

const { getUserByemail } = require("../controllers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
    const user = await getUserByemail(email);
    try {
        if (!user) {
            throw new Error({ message: "User not found!" });
        }
        const userPassword = user.password;
        const result = bcrypt.compareSync(incomingPassword, userPassword);
        if (result) {
            return issueToken(user);
        }
    } catch (error) {
        throw new Error({ message: "Invalid credentials" });
    }
};

module.exports = loginHandler;