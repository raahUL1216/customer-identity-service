import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    return res.send('Customer Identiry Service is up.');
});

router.get('/health', async (req: Request, res: Response) => {
    return res.json({ status: true })
});

export default router;