import jwt from "jsonwebtoken";

const JWT_SECRET = "MY_SECRET_KEY";

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.user_id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}