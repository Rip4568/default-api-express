function handlePrismaError(error) {
  switch (error.code) {
    case "P2002":
      const field = error.meta?.target?.[0] || "unknown field";
      return `Este ${field} já está em uso. Por favor, escolha outro.`;
    case "P2003":
      const missingField = error.meta?.field || "unknown field";
      return `O campo ${missingField} é obrigatório.`;
    case "P2025":
      const missingFields = error.meta?.cause || "unknown fields";
      return `Os campos ${missingFields} são obrigatórios.`;
    case "P2016":
      const missingRelation = error.meta?.relation_name || "unknown relation";
      return `A relação "${missingRelation}" não foi encontrada.`;
    case "P2015":
      const invalidField = error.meta?.field || "unknown field";
      return `O valor fornecido para o campo ${invalidField} é inválido.`;
    default:
      return "Erro desconhecido ao interagir com o banco de dados.";
  }
}

export { handlePrismaError };
