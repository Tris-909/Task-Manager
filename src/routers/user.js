const express = require('express');
const router = new express.Router();

const User = require('../models/user');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/users',async (req, res) => {
    
    try {
        const users = await User.find({})
        res.status(200).send(users);
    } catch(error) {
        res.status(500).send()
    }

});

router.get('/users/:id',async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const isValid = ['name', 'email', 'password'];
    const updateIsValid = updates.every((update) => isValid.includes(update));

    if (!updateIsValid) {
        return res.status(404).send('Invalid Update !');
    }

    try {
        const id = req.params.id;

        const user = await User.findById({ _id: id });
        updates.forEach((update) => {
            user[update] = req.body[update]
        });
        const result = await user.save()

        if (!result) {
            res.status(404).send();
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async(req, res) => {
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


module.exports = router;