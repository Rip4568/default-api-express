import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { generateHash } from "../../auth/hash-utils.js";
import { userSchema } from "./user-validator.js";
import yup from "yup";
import { handlePrismaError } from "../../prisma/prisma-erros.js";
const prisma = new PrismaClient();

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users).status(200);
  } catch (error) {
    return res
      .json({
        message: "erro ao listar todos os usuarios",
        error,
      })
      .status(500);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userFound = await prisma.user.findUnique({
      id,
    });
    if (!userFound) {
      return res
        .json({
          message: "usuario não encontrado",
        })
        .status(404);
    }
    return res.json({
      message: "usuario encontrado",
    });
  } catch (error) {
    return res.json({
      message: "erro ao procurar usuario",
      error,
    });
  }
});

userRouter.delete("/:id", (req, res, next) => {
  return res.send("funcionou (deletar usuario) userRouter" + req.params.id);
});

userRouter.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    await userSchema.validate(body, { abortEarly: false });
    const { password, ...secureData } = body;
    const passwordHashed = await generateHash(password);
    const userCreated = await prisma.user.create({
      data: {
        ...secureData,
        password: passwordHashed,
      },
    });
    return res.json({
      userCreated,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ errors: error.inner });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const errorMessage = handlePrismaError(error);
      return res.status(400).json({ message: errorMessage });
    }

    return res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

export { userRouter };
