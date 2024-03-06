import { object, string, number } from "yup";

const bookSchema = object().shape({
  title: string()
    .required("O título é obrigatório")
    .min(5, "O título deve ter no mínimo 5 caracteres")
    .max(255, "O título deve ter no máximo 255 caracteres"),
  summary: string(),
});

export { bookSchema };
