const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/user');


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.getToken();
        await user.save()
        res.status(201).send({ user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // this user object contain "password" and "email"
        
        const token = await user.getToken();

        // But this object below don't even though it the same user, we do this by using a method called toJSON
        // When we use res.send(), behind the screen Express will use stringify() to turn our object into JSON to send across the globe
        // toJSON() is the method in which it will interfere the obj before it get stringified 
        // toJSON() is just a function, and if toJSON return an empty object, then you will send an empty OBJ over the globe
        // Since all our routes return some information (users) mostly. We will use toJSON() to remove tokens and password from 
        // the obj we send through our API endpoints for security reason

        // The user object following User Schema, and we use toJSON on the User SCHEMA, so only the obj user will be executed by toJSON
        // And since we remove tokens and password, these props don't exist inside task obj, which is exactly what we want, because when
        // we return the user obj we erase password and tokens, if computer can't find password inside task obj (of course it can't)
        // it will return an error and break our app.

        res.send({ user: user, token });
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

router.patch('/users/me', auth ,async (req, res) => {
    const updates = Object.keys(req.body);
    const isValid = ['name', 'email', 'password'];
    const updateIsValid = updates.every((update) => isValid.includes(update));

    if (!updateIsValid) {
        return res.status(404).send('Invalid Update !');
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        });
        const result = await req.user.save()

        if (!result) {
            res.status(404).send();
        }
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async(req, res) => {
    // auth middleware will return the authenticated user information 
    // Using this information we can get access to that document on mongoDB using mongoose 
    // And delete that documents
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;