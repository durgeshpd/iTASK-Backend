const express = require('express');
const taskRouter = express.Router();
const Task = require('../models/task');
const { userAuth } = require('../middlewares/auth');

// ✅ CREATE a Task
taskRouter.post('/tasks', userAuth, async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required." });
        }

        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            userId: req.user._id, // Authenticated user from middleware
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ READ: Get all tasks of the logged-in user
taskRouter.get('/tasks', userAuth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ READ: Get a single task by ID
taskRouter.get('/tasks/:id', userAuth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE a task
taskRouter.put('/tasks/:id', userAuth, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found or not authorized" });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE a task — FIXED PATH!
taskRouter.delete('/tasks/:id', userAuth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found or not authorized" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = taskRouter;
