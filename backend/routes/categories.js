const express = require('express');
const { getCategories, addCategory, deleteCategory } = require('../controllers/categories');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getCategories)
    .post(protect, addCategory);

router.route('/:id')
    .delete(protect, deleteCategory);

module.exports = router;
