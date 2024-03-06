import { object, string } from "yup";

const userSchema = object().shape({
  email: string().email("Email inválido").required("Email é obrigatório"),
  username: string()
    .min(3, "O nome de usuário deve ter no mínimo 3 caracteres")
    .required("Nome de usuário é obrigatório"),
  firstName: string(),
  lastName: string(),
  password: string()
    .min(3, "A senha deve ter no mínimo 6 caracteres")
    .required("Senha é obrigatória"),
});

export {
  userSchema,
};
