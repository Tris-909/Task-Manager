const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/task');

router.post('/tasks', auth ,async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id })

    try {
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(400).send(error);
    }
});

// GET /tasks/me?completed=true
// GET /tasks/me?limit=10&skip=10
// GET /tasks/tasks/me?sortBy=createdAt:desc 
// GET /tasks/tasks/me?sortBy=completed:asc 

router.get('/tasks/me', auth ,async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? 1 : -1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.get('/tasks/:id' ,auth ,async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await Task.findById({ _id });    
        if (!result) {
            return res.status(404).send('Task Not Found');
        }

        if (result.owner.toString() == req.user._id.toString()) {
            return res.status(200).send(result);
        }

        res.status(401).send('Naughty boy, don\'t get other people data');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', auth ,async (req, res) => {
    const updateField = Object.keys(req.body);
    const ValidField = ['description', 'completed'];
    const isValid = updateField.every((singleField) => ValidField.includes(singleField));

    if (!isValid) {
        return res.status(400).send('Invalid field');
    }

    try {
        const task = await Task.findById({ _id: req.params.id });

        if (!task) {
            return res.status(404).send('No Task Found !');
        }

        const taskOwnerID = task.owner.toString();
        const AuthUserID = req.user._id.toString();

        if (AuthUserID == taskOwnerID) {
            updateField.forEach((update) => {
                task[update] = req.body[update];
            });
            const result = await task.save();

            return res.status(200).send(result);
        }

        res.status(401).send('You are not the same user who created this task');

    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const userAuthID = req.user._id.toString();
        const task = await Task.findById({ _id: req.params.id });
 
        if (!task) {
            res.status(404).send('Task not found');
        }

        const taskOwnerID = task.owner.toString();

        if (taskOwnerID == userAuthID) {
            const result = await Task.findByIdAndDelete(req.params.id);
            return res.status(200).send(result);
        }

        res.status(401).send("You are not the same person who create this task");
    } catch(error) {
        res.status(400).send(error);
    }
});

module.exports = router;