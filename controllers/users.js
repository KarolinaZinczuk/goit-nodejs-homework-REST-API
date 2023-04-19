const { token } = require("morgan");
const { User } = require("../models/user");
const { hashPassword } = require("../models/user");

const createUser = async (email, password) => {
    const hashedPassword = hashPassword(password);
    try {
        const newUser = new User({
            email: body.email,
            password: hashedPassword,
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log(error);
    }
};

const getUserByToken = async (token) => {
    const user = await User.findOne({ token });
    return user;
};

const logout = async (token) => {
    try {
        const user = await User.findByIdAndUpdate(
            { _id: token._id },
            { $set: { tokens: [] } },
            { new: true }
        );
        return user;
    } catch (error) {
        console.log(error);
    }
};

const currentUser = async (req, res) => {
    try {
        const { token } = req.user;
        const user = await User.getUserByToken({ token });
        if (!user) {
            res.status(401).send("not authorized");
        }
        return res.json({ token });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { createUser, getUserByToken, logout, currentUser };