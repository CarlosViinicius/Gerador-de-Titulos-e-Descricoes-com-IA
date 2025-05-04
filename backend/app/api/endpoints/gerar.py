from fastapi import APIRouter
from app.schemas.produto import Produto
from app.core.config import client

router = APIRouter()

@router.post("/gerar")
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
        return {"resultado": "Erro ao gerar conteúdo."}
