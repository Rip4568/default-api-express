import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { compareHash, generateTokenJWT } from "./hash-utils.js";
const prisma = new PrismaClient()

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const { email, username, password } = body;
    const user = await prisma.user.findUnique({
      where: {
        email, username
      }
    })
    if (!user) {
      return res.json({
        message:"credenciais inválidas, email ou username inválido"
      }).status(500)
    }
    const passwordMatch = await compareHash(password, user.password)
    if (!passwordMatch) {
      return res.json({
        "message": "credenciais inválidas, senhas incompativeis"
      }).status(500)
    }

    const token = generateTokenJWT(user);
    return res.json({
      token,
      "message": "login feito com sucesso",
    }).status(200);
  } catch (error) {
    return res
      .json({
        message: "erro ao fazer login com as credenciais",
        error,
      })
      .status(500);
  }
});

export { authRouter };
