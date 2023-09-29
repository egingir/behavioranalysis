const express = require('express');
const { check } = require('express-validator');

const behaviortestsController = require('../controllers/behaviortests-controllers');

const router = express.Router();

router.get('/', behaviortestsController.getBehaviortests);
router.get('/:id', behaviortestsController.getBehaviortestById);
router.post('/', behaviortestsController.createBehaviortest);
router.patch('/:id', behaviortestsController.updateBehaviortest);
router.delete('/:id', behaviortestsController.deleteBehaviortest);

module.exports = router;
