import { Router } from "express";
import { isAuthenticated } from "../../middleware/has-permissions.js";
import { PrismaClient } from "@prisma/client";
import { validateTokenJWT } from "../../auth/hash-utils.js";
import { bookSchema } from "./book-validator.js";
import { authMiddleware } from "../../middleware/auth-middleware.js";

const prisma = new PrismaClient();

const bookRouter = Router();
bookRouter.get("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if(!token) {
      return res.json({message:"forneça o token de autenticação"})
    }
    const data = validateTokenJWT(token.split(" ")[1])
    const books = await prisma.book.findMany({
      where: {
        userId: data.payload.id
      }, include: {
        User: true
      }
    });
    return res.json({
      message: "livros encontrados",
      count: books.length,
      books,
    });
  } catch (error) {
    return res
      .json({
        message: "erro ao buscar livros",
        error,
      })
      .status(500);
  }
});

bookRouter.delete("/:id", async (req, res, next) => {
  try {
    //isAuthenticated(req, res, next);
    // Verificar token JWT e obter o payload
    const token = req.headers.authorization;
    if(!token) {
      return res.json({message:"forneça o token de autenticação"})
    }
    const data = validateTokenJWT(token.split(" ")[1])
    const id = req.params.id;
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return res
        .json({
          message: "livro não encontrado",
        })
        .status(500);
    }
    if (!book.userId !== data.payload.id) {
      return res.json({"message": "você não é dono desse livro!"})
    }
    const bookDeleted = await prisma.book.delete(book);
    return res
      .json({
        message: "livro deletado",
        bookDeleted,
      })
      .status(200);
  } catch (error) {
    return res.json({
      message: "erro ao deletar livro",
      error,
    });
  }
});

bookRouter.post("/", authMiddleware ,async (req, res, next) => {
  try {
    const userData = req.user;


    await bookSchema.validate(req.body, {abortEarly: false})

    const { id, createdAt, updatedAt, userId, ...secureData } = req.body;
    // Criar o livro associado ao usuário do token
    const book = await prisma.book.create({
      data: { ...secureData, userId: userData.id },
    });

    // Retornar resposta de sucesso
    return res.status(201).json({
      message: "Livro criado com sucesso",
      book,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar livro",
      error,
    });
  }
});

export { bookRouter };
