import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getChallenges, getChallenge, createChallenge, applyChallenge, respondApplication } from '../controllers/challengeController.js';

const router = Router();
router.get('/', getChallenges);
router.get('/:id', getChallenge);
router.post('/', auth, createChallenge);
router.post('/:id/apply', auth, applyChallenge);
router.post('/respond-application', auth, respondApplication);
export default router;
