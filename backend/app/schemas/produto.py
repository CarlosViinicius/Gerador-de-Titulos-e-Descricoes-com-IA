from pydantic import BaseModel

# Enviado do frontend para gerar título
class Produto(BaseModel):
    categoria: str
    beneficios: str
    material: str

# Recebido/salvo no banco
class TitleCreate(BaseModel):
    titulo: str
    descricao: str

# Enviado ao frontend com ID
class Title(BaseModel):
    id: int
    titulo: str
    descricao: str

    class Config:
        orm_mode = True
