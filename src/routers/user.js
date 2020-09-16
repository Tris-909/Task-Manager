const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.getToken();
        await user.save()
        res.status(201).send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getToken();
        res.send({ user, token });
    } catch(error) {
        res.status(404).send(error);
    }
});

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save()
        
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users/logAllOut', auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Log Out From All Devices Successfully')
    } catch (error) {
        res.status(500).send(error)
    }
});

router.get('/users/me', auth ,async (req, res) => {
    res.status(200).send(req.user);
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