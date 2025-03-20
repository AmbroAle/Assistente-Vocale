from langchain_huggingface import HuggingFaceEmbeddings
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from takeDocumet import GoogleDocument
from langchain_core.documents import Document
from uuid import uuid4

class VectorDB : 
    def __init__(self):
        embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/all-MiniLM-L6-v2")
        index = faiss.IndexFlatL2(len(embeddings.embed_query("init")))
        self.vectorStore = FAISS(embedding_function = embeddings, index = index, docstore = InMemoryDocstore(),                     index_to_docstore_id = {})

    def addAllDoucments(self):
        docs = GoogleDocument()
        documents = []
        for text in  docs.getDocuments():
            documents.append(Document(page_content = text))

        self.vectorStore.add_documents(documents, id = str(uuid4()))
        print(self.vectorStore)

vectordb = VectorDB()
vectordb.addAllDoucments()