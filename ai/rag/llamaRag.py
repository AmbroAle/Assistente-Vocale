from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from .vectorDatabase import VectorDB
import time

class LlamaRAG:
    def __init__(self):
        self.retriever = VectorDB()
        self.retriever.addAllDocuments()
        self.prompt = PromptTemplate(
            template="""sei un assistente personale. Se ti vengono forniti dei documenti usali per
            rispondere con risposte precise. Altrimenti rispondi con la tuo conoscenza. Le risposte devono essere in italiano:
            
            Question: {question}
            Documents: {documents}
            Answer:
            """,
            input_variables=["question", "documents"],
        )
        
        self.llm = ChatOllama(model="llama3:latest", temperature=0)
        self.rag_chain = self.prompt | self.llm | StrOutputParser()

    def generateResponse(self, query):
        start_time = time.time()
        documents = self.retriever.searchDocument(query)
        
        mid_time = time.time()
        print(f"Tempo per la ricerca: {mid_time - start_time} secondi")
        response = self.rag_chain.invoke({"question": query, "documents": documents})
        end_time = time.time()
        print(f"Tempo totale: {end_time - start_time} secondi")
        return response
    


