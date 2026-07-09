import express, { NextFunction, Request, Response } from 'express';
import { env } from './config/env';
import { asyncHandler } from './middleware/asyncHandler';
import { errorHandler } from './middleware/errorHandler';

const app = express();

function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Access-Control-Allow-Origin', env.clientUrl);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}

app.use(corsMiddleware);
app.use(express.json());

app.get(
  '/api/health',
  asyncHandler(async (_req, res) => {
    res.status(200).json({ status: 'ok' });
  }),
);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});
