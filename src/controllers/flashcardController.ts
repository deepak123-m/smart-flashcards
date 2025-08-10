import { Request, Response } from 'express';
import { FlashcardModel } from '../models/flashcard.model';
import { classifySubject } from './subjectClassifier';
import { IFlashcardInput, IAddFlashcardResponse, IFlashcardOutput } from '@interfaces/flashcard.interface';

export const addFlashcard = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { student_id, question, answer }: IFlashcardInput = req.body;
    
    if (!student_id || !question || !answer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const subject = await classifySubject(question);
    
    const newFlashcard = await FlashcardModel.create({
      student_id,
      question,
      answer,
      subject,
    });
    
    const response: IAddFlashcardResponse = {
      message: 'Flashcard added successfully',
      subject,
    };
    
    return res.status(201).json(response);
  } catch (error) {
    console.error('Error adding flashcard:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFlashcardsBySubject = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { student_id, limit = '5' } = req.query;
    const limitNum = parseInt(limit as string, 10);
    
    if (!student_id) {
      return res.status(400).json({ message: 'student_id is required' });
    }
    
    const subjects = await FlashcardModel.distinct('subject', { student_id });
    
    if (subjects.length === 0) {
      return res.status(404).json({ message: 'No flashcards found for this student' });
    }
    
    const perSubject = Math.max(1, Math.floor(limitNum / subjects.length));
    const remainder = limitNum % subjects.length;
    
    let flashcards: IFlashcardOutput[] = [];
    
    for (let i = 0; i < subjects.length; i++) {
      const count = i < remainder ? perSubject + 1 : perSubject;
      
      const subjectFlashcards = await FlashcardModel.aggregate([
        { $match: { student_id, subject: subjects[i] } },
        { $sample: { size: count } },
        { $project: { _id: 0, student_id: 0, createdAt: 0, __v: 0 } },
      ]);
      
      flashcards = flashcards.concat(subjectFlashcards as IFlashcardOutput[]);
    }
    
    flashcards = shuffleArray(flashcards).slice(0, limitNum);
    
    return res.json(flashcards);
  } catch (error) {
    console.error('Error getting flashcards:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}