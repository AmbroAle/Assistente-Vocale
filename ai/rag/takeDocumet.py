import json
import os
from langchain_text_splitters import RecursiveCharacterTextSplitter

class GoogleDocument:
    def __init__(self):
        self.pathToSave = "files/google_docs_output.json"

    
    def getDocuments(self):
        print(f"Esiste il file? {os.path.exists(self.pathToSave)}")
        if os.path.exists(self.pathToSave):
            with open(self.pathToSave, "r", encoding= "utf-8") as file :
                data = json.load(file)
                result = []
                for elem in data :
                    result.append(elem['text'])
                return result
            
    def getSplitText(self, list : list):
        text_splitters = RecursiveCharacterTextSplitter(
                chunk_size = 5000,
                chunk_overlap = 600,
                length_function = len,
                is_separator_regex=False
            )
        texts = text_splitters.create_documents(list)
        return texts 
    
