import { IFlashcardInput, IAddFlashcardResponse, IFlashcardOutput } from '@interfaces/flashcard.interface';

declare global {
  namespace Express {
    interface Request {
    }

    interface Response {
    }
  }
}

export {};