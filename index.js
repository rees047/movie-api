const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        Models      = require('./models.js');

const app           = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

const cors  = require('cors');
app.use(cors());

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'http://testsite.com', 'https://cinefiles.netlify.app', 'http://localhost:4200', 'https://rees047.github.io'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1){ //if a specific origin isn't found on list of allowed origins
            let message =  'the CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null,true);
    }
}));

let auth    = require('./auth')(app);
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport');

const movie_model   = Models.Movie;
const user_model    = Models.User;

function connectToDB(){
    //mongoose.connect("mongodb://localhost:27017/CineFilesDB", { //localhost db connection
	mongoose.connect(process.env.CONNECTION_URI, { //connection_uri is declared in heroku config vars: connection_uri = mongodb+srv://Admin-1:rOute125!@main-cluster.7ilmh.mongodb.net/CineFilesDB?retryWrites=true&w=majority
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify : false
    }); //i have also tried 127.0.0.1
    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function callback(){
        console.log("CONNECTED");
    });
};

connectToDB();

app.use(express.static(__dirname + '/public'));


/**
 * Display API Welcome Page - this is the default view of the API
 * uses the server method : GET
 * endpoint url format: /
 * @function {get}
 * @returns{homepage url}
 */
app.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});


/**
 * Display API Documentation Page
 * uses the server method : GET
 * endpoint url format: /documentation
 * @function {get}
 * @returns{documentation page url}
 */
app.get('/documentation', (req, res) => {
    res.sendFile('/documentation.html', {
        root: __dirname + '/public'
    });
});


/**
 * Get all Movies in the database - user must be logged in to see results
 * uses the server method : GET
 * endpoint url format: /movies
 * @params {string} token
 * @function {get}
 * @returns {json(movie)} on success
 * @returns {errormessage} on failure
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//app.get('/movies', (req, res) => {
    movie_model.find()
    .then((movies) => {       
        res.status(201).json(movies);
    })
    .catch((err) => {        
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


/**
 * Find Movies By Title - user must be logged in to see results
 * uses the server method : GET
 * endpoint url format: /movies/:title
 * @params {string} title
 * @params {string} token
 * @function {get}
 * @returns {json(movie)} on success
 * @returns {errormessage} on failure
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findOne( {title : req.params.title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});


/**
 * Get Movie Genre by Movie Title - user must be logged in to see results
 * uses the server method : GET
 * endpoint url format: /movies/:title/genre
 * @params {string} title
 * @params {string} token
 * @function {get}
 * @returns {json(movie)} on success
 * @returns {errormessage} on failure
 */
app.get('/movies/:title/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findOne( {title : req.params.title })
    .then((movie) => {
        res.json(movie.title + ' :  ' + movie.genre.description);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});


/**
 * Get Genre Information by Genre Name - user must be logged in to see results
 * uses the server method : GET
 * endpoint url format: /movies/genre/:genrename
 * @params {string} genrename
 * @params {string} token
 * @function {get}
 * @returns {json(movie)} on success
 * @returns {errormessage} on failure
 */
app.get('/movies/genre/:genrename', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.find( { 'genre.name' : req.params.genrename })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


/****************
 * commented out but kept for future coding references
 * take note of the endpoint which might confuse react routing
 **************/
/**************
app.get('/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {    
    movie_model.findById(req.params.movieID)
    .then((movie) => {
        res.json(movie);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/:movieID/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.findById(req.params.movieID)
    .then((movie) => {
        res.json(movie.title + ' :  ' + movie.genre.description);
    })
    .catch((error) => {
         console.error(error);
         res.status(500).send('Error: ' + error);
    });
});
******************/


/**
 * Get Director Information by Director Name - user must be logged in to see results
 * uses the server method : GET
 * endpoint url format: /director/:director
 * @params {string} director
 * @params {string} token
 * @function {get}
 * @returns {json(movie)} on success
 * @returns {errormessage} on failure
 */
app.get('/director/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
    movie_model.find( { 'director.name' : req.params.director })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


/**
 * Register New User
 * uses the server method : POST
 * endpoint url format: /register
 * @params {string} username
 * @params {string} password
 * @params {string} firstname
 * @params {string} lastname
 * @params {email} email
 * @params {date} firstname
 * @function {post}
 * @returns {json(user)} on success
 * @returns {errormessage} on failure
 */
app.post('/register', 
    /***
     * validation logic here for request
     * you can either use a chain of methods like .not().isEmpty() which means "opposite of isEmpty" in plain english "is not empty" or use .isLength({min: 5}) which means minimum value of 5 characters are only allowed
     ***/
    [
        check('username')
            .trim().not().isEmpty().withMessage('Username must not be blank')
            .isLength({min: 5}).withMessage('Username Minimum Length is 5 Characters')
            .isAlphanumeric().withMessage('Username must be Letters and Numbers Only'),
        check('password')
            .trim().not().isEmpty().withMessage('Password must not be blank')
            .isLength({min: 5}).withMessage('Password Minimum Length is 5 Characters')
            .isAlphanumeric().withMessage('Password must be Letters and Numbers Only'),
        check('firstname')
            .trim().not().isEmpty().withMessage('First Name must not be blank')
            .isLength({min: 2}).withMessage('First Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('First Name must be Letters Only'),    
        check('lastname')
            .trim().not().isEmpty().withMessage('Last Name must not be blank')
            .isLength({min: 2}).withMessage('Last Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('Last Name must be Letters Only'),             
        check('email')
            .trim().normalizeEmail().not().isEmpty().withMessage('Email must not be blank')
            .isEmail().withMessage('Email Adddress is Invalid'),
        check('birthdate')
            .isISO8601().toDate().withMessage('Birthdate is Invalid')
    ], (req, res) => {

        //check the validation object for errors
        let errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ serverResponse: errors.array() });
        }

        let hashedPassword = user_model.hashPassword(req.body.password);
        //search to see if a user with the requested username already exists
        user_model.findOne({ username: req.body.username})
        .then((user) =>{
            //is user is found, send a response that it already exists
            if(user){
            return res.status(400).send({ serverResponse : [{ msg : req.body.username + ' already exists'} ] });
            }else{
                user_model
                .create({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hashedPassword,
                    birthdate: req.body.birthdate,
                })
                .then((user) => { res.status(201).json({ serverResponse : [{ msg : req.body.username + ' has been registered successfully'} ] }) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});


/**
 * Get all Users - user needs to be logged in
 * uses the server method : GET
 * endpoint url format: /users
 * @params {string} token
 * @function {get}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) =>{
    user_model.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


/**
 * Get User by Username - user needs to be logged in
 * uses the server method : GET
 * endpoint url format: /users/:username
 * @params {string} username
 * @params {string} token
 * @function {get}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
   user_model.findOne( {username : req.params.username })
   .then((user) => {
       res.json(user);
   })
   .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


/**
 * Update User Information - user needs to be logged in
 * uses the server method : PUT
 * endpoint url format: /users/:username
 * @params {string} username
 * @params {string} firstname
 * @params {string} lastname
 * @params {string} token
 * @function {put}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
    [
        check('firstname')
            .trim().not().isEmpty().withMessage('First Name must not be blank')
            .isLength({min: 2}).withMessage('First Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('First Name must be Letters Only'),
        check('lastname')
            .trim().not().isEmpty().withMessage('Last Name must not be blank')
            .isLength({min: 2}).withMessage('Last Name Minimum Length is 2 Characters')
            .isAlpha().withMessage('Last Name must be Letters Only')
        //check('username', 'Username is required').not().isEmpty(),
        //check('username', 'Minimum Length is 5').isLength({min: 5}),
        //check('username', 'Username must only be alphanumeric characters').isAlphanumeric(),
        //check('password', 'Password is required').not().isEmpty(),
        //check('password', 'Minimum Length is 5').isLength({min: 5}),
        //check('email', 'Email is required').not().isEmpty(),
        //check('email', 'Email Length is 5').isLength({min: 5}),
        //check('email', 'Email is invalid').isEmail()
    ], (req, res) => {
        //console.log(req.params);
        let errors = validationResult(req);
        let inputFName = '';
        let inputLName = '';
       
        if(JSON.stringify(req.query) === '{}'){
            inputFName = req.body.firstname;
            inputLName = req.body.lastname
            //console.log('empty');
       }else{
           
            inputFName = req.query.firstname;
            inputLName = req.query.lastname
            //console.log('not empty');
       }

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

       // let hashedPassword = user_model.hashPassword(req.body.password);
        user_model.findOneAndUpdate(
            { username : req.params.username },
            { $set :
                    {  
                        firstname: inputFName,
                        lastname: inputLName,
                    }
            },
            { new: true }, //this line makes sure that the updated doc is returned
            (err, updatedUser) => {
                if (err){
                    console.error(err);
                    res.status(500).send('Error: ' + error);
                }else{
                    res.json(updatedUser);
                }
            });
});


/**
 * Add Favorite Movie to User Profile - user needs to be logged in
 * uses the server method : POST
 * endpoint url format: /users/:username/movies/:movieTitle
 * @params {string} username
 * @params {string} movieTitle
 * @params {string} token
 * @function {post}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.post('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
        user_model.findOneAndUpdate(
        { username : req.params.username },
        { $push : 
            {
                favoredMovies : req.params.movietitle
            }
        },
        { new : true },
        (err, updatedUser) => {
            if (err){
                console.error(err);
                res.status(500).send('Error: ' + err);
            }else{
                response = {user: updatedUser, success : true};
                res.json(response);
            }
        }
    );
});


/**
 * Delete Favorite Movie from User Profile - user needs to be logged in
 * uses the server method : DELETE
 * endpoint url format: /users/:username/movies/:movieTitle
 * @params {string} username
 * @params {string} movieTitle
 * @params {string} token
 * @function {delete}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.delete('/users/:username/movies/:movietitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    user_model.findOneAndUpdate(
        { username : req.params.username },
        { $pull : 
            {
                favoredMovies : req.params.movietitle
            }
        },
        { new : true },
        (err, updatedUser) => {
            if (err){
                console.error(err);
                res.status(500).send('Error: ' + error);
            }else{
                res.json(updatedUser);
            }
        }
    );
});


/**
 * Delete User Profile - user needs to be logged in
 * uses the server method : DELETE
 * endpoint url format: /users/:username
 * @params {string} username
 * @params {string} token
 * @function {delete}
 * @returns {json(users)} on success
 * @returns {errormessage} on failure
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    user_model.findOneAndRemove({ username: req.params.username })
    .then((user) =>{
        if (!user){
            res.status(400).send({'res' : req.params.username +  ' was not found'});
        }else{
            res.status(200).send({'res' : req.params.username + ' was deleted'});
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

/*app.listen(8080, () =>{
    console.log('Your app is listening on port 8080');
});*/

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
	console.log('Listening on Port ' + port);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh. Somethings not working right!');
});