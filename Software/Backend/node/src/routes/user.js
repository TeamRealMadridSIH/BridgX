import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getWorkspace, linkGithub, getNotifications, markNotifRead, getMessages, sendInboxMessage, getProfile, updateProfile } from '../controllers/workspaceController.js';

const router = Router();
router.get('/workspace/:id', auth, getWorkspace);
router.post('/workspace/:id/github', auth, linkGithub);
router.get('/notifications', auth, getNotifications);
router.post('/notifications/read', auth, markNotifRead);
router.get('/messages', auth, getMessages);
router.post('/messages', auth, sendInboxMessage);
router.get('/profile/:id', getProfile);
router.put('/profile', auth, updateProfile);
export default router;
