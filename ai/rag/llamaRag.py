from langchain_ollama import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from .vectorDatabase import VectorDB
import time
from datetime import datetime

class LlamaRAG:
    llm_instance = ChatOllama(model="llama3:latest", temperature=0.6, num_ctx= 2048)

    prompt = PromptTemplate(
        template="""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        Cutting Knowledge Date: December 2023
        Today Date: {today_date}

        Sei un assistente utile e preciso. Usa i documenti forniti per rispondere con accuratezza.
        Se i documenti non contengono la risposta, basati sulla tua conoscenza.
        Rispondi solo in italiano.<|eot_id|>

        <|start_header_id|>user<|end_header_id|>
        Domanda: {question}
        Documenti: {documents}<|eot_id|>

        <|start_header_id|>assistant<|end_header_id|>
        """,
        input_variables=["question", "documents", "today_date"],
    )
    rag_chain_instance = prompt | llm_instance | StrOutputParser()
    retriever = VectorDB()

    def __init__(self):
        LlamaRAG.retriever.addAllDocuments()

    def generateResponse(self, query):
        start_time = time.time()
        documents = self.retriever.searchDocument(query)
        mid_time = time.time()
        print(f"Tempo per la ricerca: {mid_time - start_time:.2f} secondi")

        prompt_input = {
            "question": query,
            "documents": documents if documents else "Nessun documento rilevante trovato.",
            "today_date": datetime.today().strftime('%Y-%m-%d')
        }

        response = LlamaRAG.rag_chain_instance.invoke(prompt_input)

        end_time = time.time()
        print(f"Tempo totale: {end_time - start_time:.2f} secondi")
        return response
