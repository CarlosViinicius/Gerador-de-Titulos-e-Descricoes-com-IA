from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.title_model import TitleModel
from app.schemas.produto import Title, TitleCreate

router = APIRouter()

@router.get("/titles", response_model=list[Title])
def read_titles(db: Session = Depends(get_db)):
    return db.query(TitleModel).order_by(TitleModel.id.desc()).all()

@router.post("/titles", response_model=Title)
def create_title(item: TitleCreate, db: Session = Depends(get_db)):
    db_obj = TitleModel(titulo=item.titulo, descricao=item.descricao)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/titles/{title_id}", status_code=204)
def delete_title(title_id: int, db: Session = Depends(get_db)):
    db_obj = db.query(TitleModel).filter(TitleModel.id == title_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Título não encontrado")
    db.delete(db_obj)
    db.commit()
