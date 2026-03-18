import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY";

export function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    res.status(403).json({ message: "Invalid token" });

  }
}