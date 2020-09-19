const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        //Get access to header/Authorization
        const AuthorizationContent = req.header('Authorization');
        //The Content of Header/Authorization is something like 'Bearer 123123123123', we need the second part
        const arrayTakeIn = AuthorizationContent.split(' ');
        //Split the string and get the second elements since that is the token
        const token = arrayTakeIn[1];
        // Do some comparisions using this token you get from headers, combine it with secret key in the model file where you created it 
        // to return the same token 
        const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        
        // We create our token by using our ID + secret key, so now when we give our token with secret key it will return our ID
        // Using this ID to do findOne methods on Mongoose
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        // user obj that contain the user information  
        if (!user) {
            throw new Error('No user Found')
        }
        req.token = token;
        req.user = user;
        next();
    } catch(error) {
        res.status(401).send({ error: 'Please LogIn or SignUp' });
    }
}

module.exports = auth;