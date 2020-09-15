const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/users',async (req, res) => {
    
    try {
        const users = await User.find({})
        res.status(200).send(users);
    } catch(error) {
        res.status(500).send()
    }

});

app.get('/users/:id',async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await  User.findById({ _id});
        if (!user) {
            return res.status(404).send('User not found');
        } 
        res.status(200).send(user);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const isValid = ['name', 'email', 'password'];
    const updateIsValid = updates.every((update) => isValid.includes(update));

    if (!updateIsValid) {
        return res.status(404).send('Invalid Update !');
    }

    try {
        const id = req.params.id;

        const result = await User.findByIdAndUpdate({ _id: id }, req.body , { new: true, runValidators: true });
        if (!result) {
            res.status(404).send();
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/users/:id', async(req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send('No User Found');
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/tasks',async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.get('/tasks',async (req, res) => {
    try {
        const result = await Task.find({});
        res.status(200).send(result);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.get('/tasks/:id',async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
    const updateField = Object.keys(req.body);
    const ValidField = ['description', 'completed'];
    const isValid = updateField.every((singleField) => ValidField.includes(singleField));

    if (!isValid) {
        return res.status(400).send('Invalid field');
    }

    try {
        const result = await Task.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true });
        
        if (!result) {
            return res.status(404).send('No Task Found !');
        }
        res.status(200).send(result);

    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/tasks/:id', async (req, res) => {
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

app.listen(port, () => {
    console.log('Server is servered on ' + port );
});