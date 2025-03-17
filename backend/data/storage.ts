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

    async fetchFile() {
        const documentID : string = "12IlDSblRD_Q3uCgIse54mr5PHAj-02NTMI_Ko0qqWVo";
        const url = `https://docs.googleapis.com/v1/documents/${documentID}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Errore API Google Docs:', errorDetails); 
            throw new Error(`Errore API Google Docs: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("contenuto da estrarre:",data);
        return data;
    }

    public extractTitleAndText(document: any) : { title: string; text: string } | undefined {

        if (!document.body || !document.body.content) {
            console.error("Errore: la risposta non contiene il campo 'body.content'");
            return;
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
    }

    public saveToFile(data: any) : void {
        fs.writeFileSync(this.savePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Documenti salvati in: ${this.savePath}`);
    }

}

export default GoogleDriveService;