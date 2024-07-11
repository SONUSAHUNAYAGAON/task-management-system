const jwt = require("jsonwebtoken");
const SECRET_KEY = "new-user-data-sonu-sahu-cybrom";
const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized User - No token provided" });
    }

    // Check if token is in Bearer format
    if (!token.startsWith("JWT ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized User - Invalid token format" });
    }

    token = token.split(" ")[1];

    let user = jwt.verify(token, SECRET_KEY);

    // Ensure user object has _id property
    if (!user || !user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized User - Invalid token" });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized User - Token verification failed" });
  }
};

module.exports = auth;
