const { User, hashPassword } = require("../models/user");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

const createUser = async (email, password, verificationToken) => {
    const hashedPassword = hashPassword(password);
    const gravatarUrl = gravatar.url(email);
    const verificationToken = v4();
    try {
        const newUser = new User({
            email,
            password: hashedPassword,
            avatarURL: gravatarUrl,
            verificationToken,
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log(error);
    }
};

const getUserById = async (id) => {
    const user = await User.findById(id);
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

const updateToken = async (_id, token) => {
    const user = await User.findByIdAndUpdate(_id, { token });
    return user;
}

const verifyUser = async (verificationToken) => {
    const user = await User.findOne({ verificationToken });
    return user;
};

module.exports = { createUser, getUserById, getUserByemail, getUserByToken, logout, updateToken, verifyUser };