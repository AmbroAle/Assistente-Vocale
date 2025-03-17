"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class GoogleDriveService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.savePath = path_1.default.resolve('Assistente-Vocale', '../../ai/files', 'google_docs_output.json');
    }
    fetchFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.document'&trashed=false";
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/json',
                }
            });
            if (!response.ok) {
                const errorDetails = yield response.json();
                console.error('Errore API Google Docs:', errorDetails);
                throw new Error(`Errore API Google Docs: ${response.statusText}`);
            }
            const data = yield response.json();
            console.log("contenuto da estrarre:", data);
            const fileIds = data.files.map((file) => file.id);
            console.log(fileIds);
            const fileObjects = { files: fileIds.map(id => ({ id })) };
            const allDocs = yield this.fetchAllDocumets(fileObjects);
            const extractInfoDocs = this.extractTitleAndText(allDocs);
            this.saveToFile(extractInfoDocs);
        });
    }
    fetchAllDocumets(idFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = [];
            for (const file of idFiles.files) {
                const doc = yield this.fetchDocumentById(file.id);
                documents.push(doc);
            }
            console.log("Documenti recuperati:", documents);
            return documents;
        });
    }
    fetchDocumentById(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://docs.googleapis.com/v1/documents/${fileId}`;
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                console.error(`Errore nel recupero del documento ${fileId}:`, yield response.json());
                return null;
            }
            const data = yield response.json();
            console.log(`Contenuto documento ${fileId}:`, data);
            return data;
        });
    }
    extractTitleAndText(documents) {
        if (!documents || documents.length === 0) {
            console.error("Errore: nessun documento da elaborare.");
            return [];
        }
        return documents.map((document) => {
            if (!document.body || !document.body.content) {
                console.error(`Errore: la risposta per il documento '${document.title}' non contiene il campo 'body.content'`);
                return { title: document.title, text: '' };
            }
            const title = document.title;
            const text = document.body.content
                .filter((item) => item.paragraph)
                .map((item) => item.paragraph.elements)
                .flat()
                .filter((el) => el.textRun && el.textRun.content)
                .map((el) => el.textRun.content.trim())
                .join(' ');
            return { title, text };
        });
    }
    saveToFile(data) {
        fs_1.default.writeFileSync(this.savePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Tutti i documenti sono stati salvati in: ${this.savePath}`);
    }
}
exports.default = GoogleDriveService;
