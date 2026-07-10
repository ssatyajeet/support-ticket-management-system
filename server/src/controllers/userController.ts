import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await userService.list();
  res.status(200).json(users);
}
