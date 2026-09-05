const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const auth = require('../middleware/auth');

router.get('/', auth, taxController.getTaxData);
router.post('/', auth, taxController.saveTaxData);
router.post('/analyze', auth, taxController.analyzeTB);
router.post('/compute', auth, taxController.computeTax);
router.get('/export', auth, taxController.exportExcel);

module.exports = router;
