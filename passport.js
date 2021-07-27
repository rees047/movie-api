const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let user_model  = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT  = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, callback) => {
    //console.log(username + ' ' + password);
    user_model.findOne({ username : username }, (error, user) => {  

        if (error){
            //console.log(error);
            return callback(error);
        }

        if (!user){
            //console.log('incorrect username');
            return callback (null, false, {
                message : 'Incorrect Username'
            });
        }

        if(!user.validatePassword(password)){
            //console.log('incorrect password');
            return callback(null, false, { message: 'Incorrect Password' });
            
        }

        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'your_jwt_secret'
}, (jwtPayLoad, callback) => {
    return user_model.findById(jwtPayLoad._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    })
}));