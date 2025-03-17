import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

class GoogleDriveService {
    private accessToken: string;
    private savePath: string;

    public constructor(accessToken: string) {
        this.accessToken = accessToken;
        this.savePath = path.resolve('Assistente-Vocale', '../../ai/files', 'google_docs_output.json');
    }

    public async fetchFiles() {
        const url = "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&trashed=false";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Errore API Google Docs:', errorDetails); 
            throw new Error(`Errore API Google Docs: ${response.statusText}`);
        }
        const data = await response.json() as { files: { id: string }[] };
        console.log("contenuto da estrarre:",data);
        const fileIds = data.files.map((file: { id: string; }) => file.id);
        console.log(fileIds);
        const fileObjects = { files: fileIds.map(id => ({ id })) };
        const allDocs = await this.fetchAllDocumets(fileObjects);
        const extractInfoDocs = this.extractTitleAndText(allDocs);
        this.saveToFile(extractInfoDocs);
    }

    private async fetchAllDocumets(idFiles : { files: { id: string }[] } ) {
        const documents = [];

        for (const file of idFiles.files) {
            const doc = await this.fetchDocumentById(file.id);
            documents.push(doc);
        }

        console.log("Documenti recuperati:", documents);
        return documents;
    }

    private async fetchDocumentById(fileId: string) {
        const url = `https://docs.googleapis.com/v1/documents/${fileId}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            }
        });
    
        if (!response.ok) {
            console.error(`Errore nel recupero del documento ${fileId}:`, await response.json());
            return null;
        }
    
        const data = await response.json();
        console.log(`Contenuto documento ${fileId}:`, data);
        return data;
    }

    private extractTitleAndText(documents: any[]): { title: string; text: string }[] {
        if (!documents || documents.length === 0) {
            console.error("Errore: nessun documento da elaborare.");
            return [];
        }

        return documents.map((document: any) => {
            if (!document.body || !document.body.content) {
                console.error(`Errore: la risposta per il documento '${document.title}' non contiene il campo 'body.content'`);
                return { title: document.title, text: '' }; 
            }
    
            const title = document.title;
    
            const text = document.body.content
                .filter((item: any) => item.paragraph)
                .map((item: any) => item.paragraph.elements)
                .flat()
                .filter((el: any) => el.textRun && el.textRun.content)
                .map((el: any) => el.textRun.content.trim())
                .join(' ');
    
            return { title, text };
        });
    }

    private saveToFile(data: any[]): void {
        fs.writeFileSync(this.savePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Tutti i documenti sono stati salvati in: ${this.savePath}`);
    }

}

export default GoogleDriveService;