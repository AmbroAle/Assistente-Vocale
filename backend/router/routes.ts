import { Router, Request, Response, NextFunction, json } from 'express';
import GoogleDriveService from '../data/storage';

const routes = Router();

routes.post('/auth/google', async(req : Request, res : Response, next : NextFunction) => {
    const { access_token } = req.body;
    console.log(`Token: ${JSON.stringify(access_token)}`);
    const googleDriveService = new GoogleDriveService(access_token);
    const file = await googleDriveService.fetchFile();
    const content = googleDriveService.extractTitleAndText(file);
    googleDriveService.saveToFile(content);
    res.json({});
});

export default routes;