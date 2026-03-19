import { db } from "../../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt.js";

export async function loginUser(username, password) {
  const [rows] = await db.execute(
    `SELECT u.*, s.department 
     FROM users u 
     LEFT JOIN students s ON u.username = s.roll_number 
     WHERE u.username = ?`,
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
    role: user.role,
  };
}