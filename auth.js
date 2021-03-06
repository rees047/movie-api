const jwtSecret = 'your_jwt_secret'; //this has to be the same key used in the JWTStrategy

const jwt       = require('jsonwebtoken'),
    passport    = require('passport');
    
require('./passport'); //your local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username, //this is the username you're encoding in the JWT
        expiresIn: '7d', //this specifies that the token will expire in 7 days
        algorithm: 'HS256' //this is the algorithm used to "sign" or encode the values of the JWT
    });
}

/* POST Login */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        
        //console.log(req.body.username + ' ' + req.body.password);
        passport.authenticate('local', { session: false }, (error, user, info) => {
            //console.log(info);

            if (error || !user) {
                return res.status(400).json({
                    message: info,
                    user : user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error){
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}