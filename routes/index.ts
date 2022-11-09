import express, { Request, Response } from 'express';
import { verifyOpenPhoneKey } from '../lib/openphone';
import prisma from '../prisma/prisma';

const router = express.Router();

router.post('/', verifyOpenPhoneKey, async (req: Request, res: Response) => {
  try {
    const entry = await prisma.log.create({
      data: {
        data: JSON.stringify(req.body)
      }
    })
    res.status(200).json(entry)
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const entries = await prisma.log.findMany();
    const json = entries.map(e => ({ ...e, data: JSON.parse(e.data) }))
    res.status(200).json(json)
  } catch (error) {
    res.status(500).send(error);
  }
});

export = router;
