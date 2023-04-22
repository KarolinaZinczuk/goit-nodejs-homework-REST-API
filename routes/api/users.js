const express = require('express');

const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const jimp = require("jimp");

const loginHandler = require("../../auth//loginHandler");
const auth = require("../../auth/auth");

const { createUser, getUserByToken, logout} = require("../../controllers/users.js");
const { User, userValidationSchema } = require("../../models/user");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ message: "Bad Request" });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({ message: "Email in use" });
    }

    try {
        const user = await createUser(email, password);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).send({ message: "Something went wrong" });
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Bad Request" });
    }
    try {
        const token = await loginHandler(email, password);
        return res.status(200).send(token);
    } catch {
        return res.status(401).send({ message: "Email or password is wrong" });
    }
});

router.get("/logout", auth, async (req, res) => {
    try {
        const { token } = req.headers.authorization;
        const verify = jwt.verify(token, jwtSecret);
        const user = await logout(verify);
        return res.status(204).send({ message: "Logout success", user });
    } catch (error) {
        return res.status(500).send({ message: "Server error" });
    }
});

router.get("/current", auth, async (req, res) => {
    try {
        const { token } = req.user;
        const user = await getUserByToken(token);
        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        return res.status(200).json(user);
    } catch {
        return res.status(500).send({ message: "Server error" });
    }
});





const uploadTmpDir = path.join(process.cwd(), "tmp");
const avatarsDir = path.join(process.cwd(), "/public/avatars");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadTmpDir);
  },
  avatarFilePath: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({storage});

router.patch("/avatars", auth, upload.single("avatar"), async (req, res, next) => {
    const { path: temporaryName, originalname: originalName } = req.file;

    const image = await jimp.read(temporaryName);
    await image.resize(250, 250);
    await image.writeAsync(temporaryName);

    const { _id } = req.user;

    const userId = req.user.id;
    const newName = userId + "-" + originalName;
    const avatarFilePath = path.join(avatarsDir, newName);

    try {
        await fs.rename(temporaryName, avatarFilePath);

        const newData = { avatarURL: avatarFilePath };
        await updateUser(_id, newData);

        const user = await getUserById(req.user.id);
        return res.status(200).json({
            message: "File uploaded successfully", data: { avatarURL: user.avatarURL },
        });
    } catch (error) {
        console.log(error.message);
        await fs.unlink(temporaryName);
        return res.status(401).json({ message: "Not authorized" })
    }
}
);





module.exports = router;