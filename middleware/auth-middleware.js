import { validateTokenJWT } from "../auth/hash-utils.js";


function authMiddleware(req, res, next) {
  // Obter o token JWT do cabeçalho Authorization
  const authHeader = req.headers.authorization;

  // Verificar se o cabeçalho Authorization foi fornecido
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  // Extrair o token JWT do cabeçalho Authorization
  const token = authHeader.split(' ')[1];

  // Verificar a validade do token JWT
  const decoded = validateTokenJWT(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Token de autenticação inválido' });
  }

  // Adicionar o payload decodificado à requisição
  req.user = decoded.payload;
  next();
}

export { authMiddleware };