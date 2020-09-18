const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email, please try again')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length <= 6) {
                throw new Error('Password must have at least 7 characters');
            } 

            if (value.includes('password')) {
                throw new Error('Password must not contain the word : `password`');
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.getToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'Minhtri1');

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token;
}

userSchema.methods.toJSON = function() {
    const user = this;

    // Object "user" is still a json object so you want to turn it into obj and push it as the result of this function
    const result = user.toObject();     

    // Remove password and tokens from the object above so you can return the puclic obj
    // "delete" method can be accessed from schema 
    delete result.password 
    delete result.tokens
    delete result.avatar

    return result;
}

// Create a static Function to apply to Schema 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('No User Found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Wrong password or email, please try again !');
    }

    return user;
}

// hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
