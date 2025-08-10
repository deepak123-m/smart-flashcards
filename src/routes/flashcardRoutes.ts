import { Router } from 'express';
import { addFlashcard, getFlashcardsBySubject } from '../controllers/flashcardController';

const router = Router();

router.post('/flashcard', addFlashcard);

router.get('/get-subject', getFlashcardsBySubject);

export default router;