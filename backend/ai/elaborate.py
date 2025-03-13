import ollama

class Elaborate:
    def __init__(self):
        self.model = "llama3"

    def get_from_text(self, text : str):
        response = ollama.chat(
            model=self.model,
            messages=[
                {
                    "role": "user",
                    "content": text,  
                },
            ],
        )
        return response["message"]["content"]  
    
