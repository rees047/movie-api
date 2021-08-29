# movie-api
 movie-api created using Node JS

**OBJECTIVE**: The objective of this project is to be able to demonstrate the capability of NODE JS. The movie api is built using mongodb as the database and authentication is implemented by passport jwt, json webtoken and cors.

Authentication is implemented to display the importance of privacy and data authorization especially in our current time where digital piracy is rampant.

**DESCRIPTION**: A NoSQL database is used. The database holds a collection of movie information such as but not limited to movie title, genre, rating and director name among others.

The database also holds data for user profiles and registration.
Users can create profiles, delete profile and add and/or delete favorite movies to their profile.

Endpoints are used to access and return the requested data.
The endpoints are tested using postman to make sure they are working

Endpoints are:  
[post]    register:               /register  
[get]     get all movies:         /movies  
[get]     get single movie:       /movies/:movie  
[get]     get genre:              /movies/genre/:genrename  
[get]     get director:           /director/:director  
[get]     get username:           /users/:username  
[post]    add favorite movie:     /users/:username/movies/:movietitle  
[delete]  delete favorite movie:  /users/:username/movies/:movietitle  
[delete]  delete user profile:    /users/:username  

**LIVE DEMO**:https://cinefiles-api.herokuapp.com/

**TECHNOLOGIES**:
  "dependencies": {  
    "bcrypt": "^5.0.1",  
    "body-parser": "^1.19.0",  
    "cors": "^2.8.5",  
    "express": "^4.17.1",  
    "express-validator": "^6.12.0",  
    "jsonwebtoken": "^8.5.1",  
    "mongoose": "^5.13.2",  
    "morgan": "^1.10.0",  
    "passport": "^0.4.1",  
    "passport-jwt": "^4.0.0",  
    "passport-local": "^1.0.0",  
    "uuid": "^8.3.2"  
  }