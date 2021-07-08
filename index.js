const   express     = require('express'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        Models      = require('./models.js');

const app           = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const movie_model   = Models.Movie;
const user_model    = Models.User;
mongoose.connect('mongodb://localhost:27017/CineFilesDB',{
    useNewUrlParser : true,
    useUnifiedTopology : true
});

function connectToDB(){
    mongoose.connect("mongodb://localhost/test"); //i have also tried 127.0.0.1
    db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function callback(){
        console.log("CONNECTED");
    });
};

app.get('/', (req, res) => {
    res.send('You are on the Home Page!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('/documentation.html', {
        root: __dirname + '/public'
    });
});

app.get('/movies', (req, res) => {
    movie_model.find()
    .then((movies) => {       
        res.status(201).json(movies);
    })
    .catch((err) => {        
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.get('/movies/:title', (req, res) => {
    let movie = movies.find((movie) => {
        return movie.title === req.params.title
    });

    if (movie){
        res.status(201).json(movie);
    }else{
        res.status(404).send('Movie Not Found.');
    }
});

app.get('/movies/:title/genre', (req, res) => {
    let movie = movies.find((movie) => {
        return movie.title === req.params.title
    });

    if (movie){
        res.status(201).send(movie.title + ' has genre of ' + movie.genre);
    }else{
        res.status(404).send('Movie Not Found.');
    }
});

app.get('/movies/director/:director', (req, res) => {
    let directed_movies = [];
    
    let movie = movies.find((movie) => {
        for (let i = 0; i < movie.director.length; i++){
            if (movie.director[i] === req.params.director){               
                directed_movies.push(movie);
            }
        }        
    });

    if(directed_movies.length != 0 ){
        res.status(201).json(directed_movies);
    }else{
        res.status(404).send('No movies found for this director');
    }
});

app.post('/users/register', (req, res) => {
    user_model.findOne({ username: req.body.username})
    .then((user) =>{
        if(user){
            return res.status(400).send(req.body.username + ' already exists');
        }else{
            user_model
            .create({
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                birthdate: req.body.birthdate,
            })
            .then((user) => { res.status(201).json(user) })
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

app.get('/users', (req, res) =>{
    user_model.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.get('/users/:username', (req, res) => {
   user_model.findOne( {username : req.params.username })
   .then((user) => {
       res.json(user);
   })
   .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

app.put('/users/:username/update', (req, res) => {
   user_model.findOneAndUpdate(
       { username : req.params.username },
       { $set :
            {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthdate : req.body.birthday
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

app.put('/users/:username/favorites/add/:movieID', (req, res) => {
    user_model.findOneAndUpdate(
        { username : req.params.username },
        { $push : 
            {
                favoredMovies : req.params.movieID
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

app.delete('/users/:username/favorites/remove/:movieID', (req, res) => {
    user_model.findOneAndUpdate(
        { username : req.params.username },
        { $pull : 
            {
                favoredMovies : req.params.movieID
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

app.delete('/users/:username/delete', (req, res) => {
    user_model.findOneAndRemove({ username: req.params.username })
    .then((user) =>{
        if (!user){
            res.status(400).send(req.params.username +  ' was not found');
        }else{
            res.status(200).send(req.params.username + ' was deleted');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});


app.listen(8080, () =>{
    console.log('Your app is listening on port 8080');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uh-oh. Somethings not working right!');
});