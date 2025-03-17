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
    fetchFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const documentID = "12IlDSblRD_Q3uCgIse54mr5PHAj-02NTMI_Ko0qqWVo";
            const url = `https://docs.googleapis.com/v1/documents/${documentID}`;
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                const errorDetails = yield response.json();
                console.error('Errore API Google Docs:', errorDetails);
                throw new Error(`Errore API Google Docs: ${response.statusText}`);
            }
            const data = yield response.json();
            console.log("contenuto da estrarre:", data);
            return data;
        });
    }
    extractTitleAndText(document) {
        if (!document.body || !document.body.content) {
            console.error("Errore: la risposta non contiene il campo 'body.content'");
            return;
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
    }
    saveToFile(data) {
        fs_1.default.writeFileSync(this.savePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Documenti salvati in: ${this.savePath}`);
    }
}
exports.default = GoogleDriveService;
