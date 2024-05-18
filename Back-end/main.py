from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine, get_db
from routers import user,item,category,auth,qa,user_rating,bid,save

app = FastAPI()

# Define allowed origins
origins = [
    "http://localhost",
    "http://localhost:3000",  # Add your frontend URL
]

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(engine)

app.include_router(user.router)
app.include_router(item.router)
app.include_router(category.router)
app.include_router(auth.router)
app.include_router(qa.router)
app.include_router(user_rating.router)
app.include_router(bid.router)
app.include_router(save.router)
