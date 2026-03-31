import { prisma } from "../config/prisma.js";

export const upsertUser = async (googleId: string, email: string, name: string, image: string) => {
  return await prisma.user.upsert({
    where: { googleId },
    update: { name, image },
    create: { googleId, email, name, image },
  });
};
