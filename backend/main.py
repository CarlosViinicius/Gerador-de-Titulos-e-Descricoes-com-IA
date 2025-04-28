from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

app = FastAPI()

# Libera acesso do frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de dados do React
class Produto(BaseModel):
    categoria: str
    beneficios: str
    material: str

# Cliente da OpenAI com sua API Key
client = OpenAI(api_key="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")  # <- Substitua pela sua chave real

@app.post("/gerar")
def gerar_titulo_descricao(produto: Produto):
    try:
        prompt = (
            f"Crie um título e uma descrição para um produto com base nas informações:\n"
            f"Categoria: {produto.categoria}\n"
            f"Benefícios: {produto.beneficios}\n"
            f"Material: {produto.material}\n"
            f"Formato: \nTítulo: ...\nDescrição: ..."
        )

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
        return {"resultado": resultado}

    except Exception as e:
        import traceback
        print("Erro ao gerar conteúdo:")
        traceback.print_exc()
        return {"resultado": "Erro ao gerar conteúdo."}
