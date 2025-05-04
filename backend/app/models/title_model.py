from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class TitleModel(Base):
    __tablename__ = "titles"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=False)
