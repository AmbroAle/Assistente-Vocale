from fastapi import FastAPI
from ai import elaborate

app = FastAPI()
ai = elaborate.Elaborate()

@app.get("/")
async def root():
    return "Server in ascolto su porta:8000"

@app.get("/chat/")
async def chat(query: str):
    response = ai.get_from_text(query) 
    return response


    