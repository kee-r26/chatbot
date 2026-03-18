import bcrypt from "bcrypt";

export async function createHash(req, res) {
    const { input } = req.body;
    const hash = await bcrypt.hash(input, 10);
    res.json({ hash });
}   