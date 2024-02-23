const express = require('express');
const fs = require('fs');
const {signup, login} = require('./controller/authController');
const mongoose = require('mongoose');
require('dotenv').config();
const newsArticlesPromise = require('./helpers/newsArticles')
const verifyToken = require('./authJWT');
const {default: axios} = require('axios');
const app = express();
const port = 3000;
const User = require('./models/User');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

    try {
        mongoose.connect("mongodb://localhost:27017/users", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connected to the db");
    } catch (err) {
        conosole.log("Connection to the db failed");
    }

app.get('/', (req, res) => {
    return res.status(200).send("Hello world");
});

app.get('/preferences', verifyToken, (req, res) => {
    if(req.user) {
        return res.status(200).send(req.user.preferences);
    } else {
        return res.status(403).send({
            message: req.message
        });
    }
});

app.put('/preferences', verifyToken, (req, res) => {
    if(req.user) {
        let preferences = req.user.preferences;
        preferences = preferences.concat(req.body.preferences);
        req.user.preferences = preferences;
        req.user.save().then((resp) => {
            return res.status(200).send("saved");
        }).catch((err) => {
            return res.status(400).send("failed");
        });
    } else {
        return res.status(403).send({
            message: req.message
        });
    }
});

app.get('/news', verifyToken, async (req, res) => {

    let totalResult = [];
    let preferences = req.user.preferences;
    for(let i= 0;i < preferences.length;i ++) {
        let url = `https://newsapi.org/v2/top-headlines?q=${preferences[i]}&pageSize=2&apiKey=fcfcffd8cb7747ea89db4d1fb13e2483`;
        let data = await newsArticlesPromise(url);
        data["articles"].forEach(article => {
            totalResult.push(article);
        });    }
    return res.status(200).json(totalResult);
    
});



app.post('/login', login);

app.post('/register', signup);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});




module.exports = app;