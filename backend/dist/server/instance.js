"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../router/routes"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.setupMiddlewares();
        this.setupCors();
        this.setupRoutes();
    }
    setupMiddlewares() {
        this.app.use(express_1.default.json());
    }
    setupRoutes() {
        this.app.use(routes_1.default);
    }
    setupCors() {
        this.app.use((0, cors_1.default)());
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server avviato su http://localhost:${this.port}`);
        });
    }
}
exports.default = Server;
