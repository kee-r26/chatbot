import { db } from "../../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.js";

export async function loginUser(username, password) {

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  const user = rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error("Invalid password");
  }

  const token = generateToken(user);

  return {
    token,
    role: user.role
  };
}