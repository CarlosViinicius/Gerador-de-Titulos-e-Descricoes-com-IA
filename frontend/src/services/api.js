// URL base do backend - vai pegar a variável do ambiente configurada no .env ou docker-compose.yml
const API_URL = process.env.REACT_APP_API_URL;

// Função para carregar todos os títulos
export const fetchTitles = async () => {
  try {
    const response = await fetch(`${API_URL}/titles`);
    if (!response.ok) {
      throw new Error("Erro ao carregar títulos");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

// Função para gerar título e descrição com base nos dados enviados
export const generateTitleDescription = async (data) => {
  try {
    const response = await fetch(`${API_URL}/gerar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Erro ao gerar título/descrição");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

// Função para salvar um título no banco de dados
export const saveTitle = async (titulo, descricao) => {
  try {
    const response = await fetch(`${API_URL}/titles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, descricao }),
    });
    if (!response.ok) {
      throw new Error("Erro ao salvar título");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

// Função para deletar um título
export const deleteTitle = async (id) => {
  try {
    const response = await fetch(`${API_URL}/titles/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar título");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};
