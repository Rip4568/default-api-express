import { response } from "express";
import { validateTokenJWT } from "../auth/hash-utils.js";

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({
      "message": "não autorizado, passe o token"
    })
  }
  const result = validateTokenJWT(token.split(' ')[1])
  if (!result) {
    return res.json({
      "message": "não autorizado"
    })
  }
  next()
}

export {
  isAuthenticated
}