from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag.llamaRag import LlamaRAG
from fastapi.responses import StreamingResponse


class UserInput(BaseModel):
    message: str


class Server:
    def __init__(self, port: int):
        self.port = port
        self.app = FastAPI()
        self.app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  
        allow_credentials=True,
        allow_methods=["*"],  
        allow_headers=["*"],  
)
        self.setup_routes()
        self.llm = LlamaRAG()

    def setup_routes(self):
        @self.app.post("/chat")
        async def chat_with_ai(user_input : UserInput):
           return self.llm.generateResponse(user_input.message)

    def run(self):
        uvicorn.run(self.app, host="0.0.0.0", port=self.port)
