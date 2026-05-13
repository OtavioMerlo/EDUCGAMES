const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  getActivities, getActivity, submitActivity,
  createActivity, updateActivity, gradeSubmission, getMySubmissions
} = require('../controllers/activity.controller');

const router = express.Router();

router.get('/', authenticate, getActivities);
router.get('/my-submissions', authenticate, getMySubmissions);
router.get('/:id', authenticate, getActivity);
router.post('/:id/submit', authenticate, authorize('STUDENT'), submitActivity);
router.post('/', authenticate, authorize('TEACHER', 'ADMIN'), createActivity);
router.put('/:id', authenticate, authorize('TEACHER', 'ADMIN'), updateActivity);
router.post('/submissions/:id/grade', authenticate, authorize('TEACHER', 'ADMIN'), gradeSubmission);

module.exports = router;
