from langchain_huggingface import HuggingFaceEmbeddings
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from .takeDocumet import GoogleDocument
from langchain_core.documents import Document
from uuid import uuid4

class VectorDB : 
    def __init__(self):
        embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/all-MiniLM-L6-v2")
        index = faiss.IndexFlatL2(len(embeddings.embed_query("init")))
        self.vectorStore = FAISS(embedding_function = embeddings, index = index, docstore = InMemoryDocstore(),                     index_to_docstore_id = {})

    def addAllDocuments(self):
        docs = GoogleDocument()
        documents = []
        for text in  docs.getDocuments():
            documents.append(Document(page_content = text))

        self.vectorStore.add_documents(documents, id = str(uuid4()))
    
    def searchDocument(self, query: str):
        result = self.vectorStore.similarity_search_with_score(query, k=1)
        res = None
        for text, score in result:
            print(f"Punteggio di similarità: {score}") 
            if 0.3 <= score <= 1:
                res = text.page_content

        if res:
            return res
        return "Nessun documento trovato con sufficiente compatibilità."