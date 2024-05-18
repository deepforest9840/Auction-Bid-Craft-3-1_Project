import base64
from fastapi import APIRouter, Depends,status,HTTPException,Response
from typing import List
from respository import category
from sqlalchemy.orm import Session
import schemas,database,models

router = APIRouter(
    prefix='/category',
    tags=['category']
)


@router.post('/create',status_code=status.HTTP_201_CREATED)
def list_category(request : schemas.Category,db: Session = Depends(database.get_db)):
    new_category =  category.list_category(request,db)
    if not new_category:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail=f'User not created')
    else:
        return 'created'
    
    
@router.post('/get_items', response_model=schemas.ShowCategory, status_code=status.HTTP_302_FOUND)
def get_items(request: schemas.Category, db: Session = Depends(database.get_db)):
    category = db.query(models.Category).filter(models.Category.category_name == request.name).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    items = db.query(models.Item).join(models.ItemCategory).filter(models.ItemCategory.category_id == category.category_id).all()
    for item in items:
        if item.pic:
            item.pic = base64.b64encode(item.pic).decode('utf-8')
    
    return {"name": category.category_name,"id": category.category_id, "items": items}

@router.get('/get_all', status_code=status.HTTP_302_FOUND)
def get_category(db: Session = Depends(database.get_db)):
    categories = db.query(models.Category).all()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return categories

@router.get('/get_item', response_model=schemas.ShowCategory, status_code=status.HTTP_302_FOUND)
def get_items(id, db: Session = Depends(database.get_db)):
    items = db.query(models.Item).join(models.ItemCategory).filter(models.ItemCategory.category_id == id).all()
    category = db.query(models.Category).filter(models.Category.category_id==id).first()
    if not items:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail=f'No content found')
    for item in items:
        if item.pic:
            item.pic = base64.b64encode(item.pic).decode('utf-8')
    
    return {"name": category.category_name,"id": category.category_id, "items": items}

@router.get('/get_category_name', status_code=status.HTTP_302_FOUND)
def get_category_name(id, db: Session = Depends(database.get_db)):
    category = db.query(models.Category).filter(models.Category.category_id==id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail=f'No category found')
    return {"name": category.category_name}
