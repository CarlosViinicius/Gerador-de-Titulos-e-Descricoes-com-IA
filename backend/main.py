from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
import os
from pathlib import Path

# Carrega variáveis do arquivo .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# Configura o CORS para permitir o frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Endereço do seu React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de dados esperado do frontend
class Produto(BaseModel):
    categoria: str
    beneficios: str
    material: str

# Busca a chave da API
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API_KEY não encontrada. Verifique o arquivo .env.")

# Cria o cliente da OpenAI
client = OpenAI(api_key=API_KEY)

# Rota para gerar título e descrição
@app.post("/gerar")
def gerar_titulo_descricao(produto: Produto):
    try:
        print("\n========= NOVA REQUISIÇÃO =========")
        print(f"Categoria recebida: {produto.categoria}")
        print(f"Benefícios recebidos: {produto.beneficios}")
        print(f"Material recebido: {produto.material}")

        prompt = (
            f"Crie um título e uma descrição para um produto com base nas informações:\n"
            f"Categoria: {produto.categoria}\n"
            f"Benefícios: {produto.beneficios}\n"
            f"Material: {produto.material}\n"
            f"Formato: \nTítulo: ...\nDescrição: ..."
        )

        print("\nPrompt montado para enviar à OpenAI:")
        print(prompt)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um especialista em marketing de produtos."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        resultado = response.choices[0].message.content

        print("\n========= RESPOSTA RECEBIDA =========")
        print(resultado)

        return {"resultado": resultado}

    except Exception as e:
        print("\n========= ERRO NO BACKEND =========")
        import traceback
        traceback.print_exc()
        return {"resultado": "Erro ao gerar conteúdo."}
