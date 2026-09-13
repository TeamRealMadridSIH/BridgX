import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getProblems, getProblem, createProblem, upvoteProblem, requestSolve, respondSolveRequest, markSolved } from '../controllers/problemController.js';

const router = Router();
router.get('/', getProblems);
router.get('/:id', getProblem);
router.post('/', auth, createProblem);
router.post('/:id/upvote', auth, upvoteProblem);
router.post('/:id/request-solve', auth, requestSolve);
router.post('/respond-solve', auth, respondSolveRequest);
router.post('/:id/mark-solved', auth, markSolved);
export default router;
