
// export async function loginUser(req, res) {
//     const { username, password } = req.body
//     // Implementation for user login
//     const result = await authenticateUser(username, password)
//     if (result.success) {
//         res.json({ success: true, token: result.token })
//     } else {
//         res.status(401).json({ success: false, message: "Invalid credentials" })
//     }
// }

import { loginUser } from "../services/auth.service.js";

export async function login(req, res) {
  try {

    const { username, password } = req.body;

    const { token, role } = await loginUser(username, password);


    // Send token to frontend
    res.json({
      success: true,
      token,
      role
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: error.message
    });

  }
}