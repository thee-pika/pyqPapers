import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { prisma } from "db/client";
config();

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const verifyPassword = async (
  userpassword: string,
  password: string
) => {
  const isMatch = await bcrypt.compare(userpassword, password);
  return isMatch;
};

export const createTokens = (userId: string) => {
  const access_token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
  const refresh_token = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "3d" }
  );
  return { access_token, refresh_token };
};

export const getRefreshTokens = async (userRefreshToken: string) => {
    
  const SECRET = process.env.REFRESH_TOKEN_SECRET;

  if (!SECRET) {
    throw new Error(" secrets are not defined!");
  }

  const decoded = jwt.verify(userRefreshToken, SECRET);

  if (!(typeof decoded === "object" && "userId" in decoded)) {
    throw new Error("Not a valid object or id not exist");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new Error("access token not found!!");
  }

  if (user.refresh_token !== userRefreshToken) {
    throw new Error("Invalid refresh token");
  }

  const { access_token, refresh_token } = createTokens(user.id);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refresh_token,
    },
  });
};
