import { Document } from 'mongoose';

export interface IFlashcard {
  student_id: string;
  question: string;
  answer: string;
  subject: string;
  createdAt?: Date;
}

export interface IFlashcardDocument extends IFlashcard, Document {}

export interface IFlashcardInput {
  student_id: string;
  question: string;
  answer: string;
}

export interface IFlashcardOutput {
  question: string;
  answer: string;
  subject: string;
}

export interface IAddFlashcardResponse {
  message: string;
  subject: string;
}