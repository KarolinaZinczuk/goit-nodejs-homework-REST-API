const { User, hashPassword } = require("../models/user");
const gravatar = require("gravatar");

const createUser = async (email, password) => {
    const hashedPassword = hashPassword(password);
    const gravatarUrl = gravatar.url(email);
    try {
        const newUser = new User({
            email,
            password: hashedPassword,
            avatarURL: gravatarUrl,
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log(error);
    }
};

const getUserById = async (id) => {
    const user = await User.findOne({ id });
    return user;
};

const getUserByemail = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

const getUserByToken = async (token) => {
    const user = await User.findOne({ token });
    return user;
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    return res.status(204).send();
};

const verifyUser = async (verifyToken) => {
    const user = await User.findOne({ verifyToken });
    return user;
};

module.exports = { createUser, getUserById, getUserByemail, getUserByToken, logout, verifyUser };