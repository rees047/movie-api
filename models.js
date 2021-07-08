const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    title: {type: String, require : true},
    description: {type: String, required: true},
    genre:{
        name: String,
        description: String,
    },
    rating:{
        name: String,
        description: String,
    },
    year: String,
    release: String,
    runtime: String,
    description: String,
    director: {
        name: String,
        bio: String,
        birthdate: Date,
        deathdate: Date,
    },
    cast: [String],
    gross: String,
    budget: String,
    featured : Boolean,
    imagePath : String        
});

let userSchema = mongoose.Schema({
    username: {type: String, require : true},
    firstname: {type: String, require : true},
    lastname: {type: String, require : true},
    email: {type: String, require : true},
    password: {type: String, require : true},
    birthdate: Date,
    favoredMovies : [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema, 'movies');
let User = mongoose.model('Users', userSchema, 'users');

module.exports.Movie = Movie;
module.exports.User = User;