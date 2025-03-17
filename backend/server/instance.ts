import express, { Application } from 'express';
import routes from '../router/routes';
import cors from 'cors';

export default class Server {
    private app: Application;
    private port: number;

    public constructor(port: number) {
        this.app = express();
        this.port = port;

        this.setupMiddlewares();
        this.setupCors();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        this.app.use(routes); 
    }

    private setupCors(): void {
        this.app.use(cors()); 
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server avviato su http://localhost:${this.port}`);
        });
    }
}