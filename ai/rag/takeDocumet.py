import json
import os

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