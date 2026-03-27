import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.user_id,
      role: user.role,
      department: user.department || null, // Include department in the payload
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}