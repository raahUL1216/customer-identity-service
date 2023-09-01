import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/identify', async (req: Request, res: Response) => {
    return res.json({ contact: req.body })
});

export default router;