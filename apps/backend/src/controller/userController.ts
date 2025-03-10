import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export const verifyPassword = async (userpassword: string, password: string) => {

    const isMatch = await bcrypt.compare(userpassword, password);
    return isMatch;

}

export const createTokens = (userId: string) => {
    const access_token = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1h" });
    const refresh_token = jwt.sign(userId, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "3d" });
    return { access_token, refresh_token };
}
