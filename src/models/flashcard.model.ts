import { Schema, model, Document } from 'mongoose';
import { IFlashcard } from '@interfaces/flashcard.interface';

type FlashcardDocument = IFlashcard & Document;

const flashcardSchema = new Schema<FlashcardDocument>({
  student_id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FlashcardModel = model<FlashcardDocument>('Flashcard', flashcardSchema);