const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const auth = require('../middlewares/auth');

router.post('/', auth, linkController.createLink);
// router.post('/', auth, createLink);
router.get('/', auth, linkController.getLinksWithStatus); // Updated to check expired links
router.get('/test', (req, res) => {
  res.json({ message: 'Links API is working', timestamp: new Date().toISOString() });
});
router.get('/check-alias', linkController.checkAlias); // No auth required for checking alias

// Public route to get link by short URL (must come before /:id routes)
router.get('/:url', linkController.getLinkByUrl);

router.put('/:id', auth, linkController.updateLink);
router.delete('/:id', auth, linkController.deleteLink);

// New endpoints for link tracking and analytics
router.post('/:linkId/track-view', linkController.trackLinkView); // No auth required for tracking views
router.get('/:linkId/analytics', auth, linkController.getLinkAnalytics);

module.exports = router; 