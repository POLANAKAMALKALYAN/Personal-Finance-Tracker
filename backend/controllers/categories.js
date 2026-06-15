const Category = require('../models/Category');

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add category
// @route   POST /api/categories
// @access  Private
exports.addCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        const category = await Category.create({
            name,
            type,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, error: 'No category found' });
        }

        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
