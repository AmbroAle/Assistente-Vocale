from langchain.prompts import PromptTemplate
from .vectorDatabase import VectorDB
import time
from datetime import datetime
from llama_cpp import Llama

class LlamaRAG:
    llm_instance = Llama(model_path="model/Llama-3.2-1B-Instruct-f16.gguf", n_gpu_layers=24, n_ctx=4000, verbose=True)

    prompt = PromptTemplate(
        template="""<|start_header_id|>system<|end_header_id|>
        Cutting Knowledge Date: December 2023
        Today Date: {today_date}

        Sei un assistente utile e preciso. Usa  i documenti forniti per rispondere con accuratezza.
        Se i documenti  non sono disponibili, basati sulla tua conoscenza.
        Rispondi solo in italiano.<|eot_id|>

        <|start_header_id|>user<|end_header_id|>
        Domanda: {question}
        Documenti: {documents}<|eot_id|>

        <|start_header_id|>assistant<|end_header_id|>
        """,
        input_variables=["question", "documents", "today_date"],
    )
    
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
            "documents":"\n\n".join(doc.page_content if hasattr(doc, 'page_content') else doc for doc in documents) if documents    else "Nessun documento rilevante trovato.",
            "today_date": datetime.today().strftime('%Y-%m-%d')
        }
        formatted_prompt = LlamaRAG.prompt.format(**prompt_input) 
        print(formatted_prompt)
        response_obj = LlamaRAG.llm_instance(formatted_prompt, max_tokens=3000)  
        response_text = response_obj["choices"][0]["text"].strip()

        end_time = time.time()
        print(f"Tempo totale: {end_time - start_time:.2f} secondi")
        return response_text