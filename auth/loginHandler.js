const bcrypt = require("bcrypt");

const getUserByemail = require("../controllers/users");
const issueToken = require("./issueToken");

const loginHandler = async (email, incomingPassword) => {
    const user = await getUserByemail(email);
    if (!user) {
        return res.status(404).send({ message: "User not found!" });
    }
    const userPassword = user.password;

    const result = bcrypt.compareSync(incomingPassword, userPassword);
    
    if (result) {
        return issueToken(user);
    } else {
        return res.status(401).send({ message: "Invalid credentials" });
    }
};

module.exports = loginHandler;