import { Request, Response } from 'express';
import { parseInstruction } from '../config/llm';
 
export async function parse(req: Request, res: Response) {
  console.log('Parsing instruction:', req.body);
  try {
    const { instruction } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required' });
    }
    const parsed = await parseInstruction(instruction);
    res.json(parsed);
  } catch (error) { 
    console.error('Error parsing instruction:', error);
    res.status(500).json({ error: 'Parsing failed' });
  }
}

