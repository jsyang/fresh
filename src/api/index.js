const {ObjectID} = require('mongodb');
const {connect}  = require('./mongoClient');
const ddos       = require('ddos');
const helmet     = require('helmet');

const express = require('express');
const app     = express();

// Basic security
app.use((new ddos).express);
app.use(helmet());

// Primitive auth
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-username,x-password,content-type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    // Requests that don't need auth
    if (req.path === '/users') {
        req.username = 'fresh';
        req.password = 'read0nly';
    } else {
        req.username = req.headers['x-username'];
        req.password = req.headers['x-password'];
    }

    const {username, password} = req;

    if (username && password) {
        next();
    } else {
        res.status(403).send('Need to send authentication headers!');
    }
});

app.use(express.json());

app.get('/:collection', ({username, password, params}, res) => {
    connect(username, password)
        .then(({db, client}) => db.collection(params.collection).find({}).toArray((err, result) => {
            client.close();
            res.json(result);
        }))
        .catch(err => res.status(400).send(err))
});

app.post('/tasks/:id', ({username, password, params, body}, res) => {
    connect(username, password)
        .then(({db, client}) => db.collection('tasks')
            .updateOne({_id: ObjectID(params.id)}, {$set: body}, (err, result) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send();
                }

                client.close();
            })
        )
        .catch(err => res.status(400).send(err))
});

require('http').createServer(app).listen(
    process.env.PORT || 3001,
    err => err ? console.error(err) : console.log('Get busy!')
);