const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    const { id } = decodedToken;

    const user = await getUserById(id);
    const userToken = user.token;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (token !== userToken) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = auth;