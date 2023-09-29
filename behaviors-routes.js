const express = require('express');
const { check } = require('express-validator');

const behaviorsController = require('../controllers/behaviors-controllers');

const router = express.Router();

router.get('/', behaviorsController.getBehaviors);
router.get('/:id', behaviorsController.getBehaviorById);
router.post('/', behaviorsController.createBehavior);
router.patch('/:id', behaviorsController.updateBehavior);
router.delete('/:id', behaviorsController.deleteBehavior);

module.exports = router;
