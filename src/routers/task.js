const express = require('express');
const router = new express.Router();

const Task = require('../models/task');

router.post('/tasks',async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.get('/tasks',async (req, res) => {
    try {
        const result = await Task.find({});
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send(error);
    }
});

router.get('/tasks/:id',async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await Task.findById({ _id });
        if (!result) {
            return res.status(404).send('Task Not Found');
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const updateField = Object.keys(req.body);
    const ValidField = ['description', 'completed'];
    const isValid = updateField.every((singleField) => ValidField.includes(singleField));

    if (!isValid) {
        return res.status(400).send('Invalid field');
    }

    try {
        const task = await Task.findById({ _id: req.params.id });
        updateField.forEach((update) => {
            task[update] = req.body[update];
        });
        const result = await task.save();
        
        if (!result) {
            return res.status(404).send('No Task Found !');
        }
        res.status(200).send(result);

    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send('Task not found');
        }
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send(error);
    }
});

module.exports = router;