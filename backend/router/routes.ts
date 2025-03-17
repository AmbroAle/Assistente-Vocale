import { Router, Request, Response, NextFunction, json } from 'express';
import GoogleDriveService from '../data/storage';

const routes = Router();

routes.post('/auth/google', async(req : Request, res : Response, next : NextFunction) => {
    const { access_token } = req.body;
    console.log(`Token: ${JSON.stringify(access_token)}`);
    const googleDriveService = new GoogleDriveService(access_token);
    await googleDriveService.fetchFiles();
    res.json({});
});

export default routes;