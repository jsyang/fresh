const {ObjectID} = require('mongodb');
const {connect}  = require('./mongoClient');
const ddos       = require('ddos');
const helmet     = require('helmet');

const express = require('express');
const app     = express();

// Basic security
app.use((new ddos).express);
app.use(helmet());

// Redirect to project homepage if trying to access the API directly in browser
app.get('/', (req, res) => res.redirect(require('../../package.json').homepage));

// Primitive auth
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-username,x-password,content-type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    // Requests that don't need auth
    if (req.path === '/users') {
        req.username = process.env.MLAB_READONLY_USER || 'fresh';
        req.password = process.env.MLAB_READONLY_PASS || 'read0nly';
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

const COLLECTION_TRANSFORMS = {
    users: (user) => ({name: user.name}),
    tasks: task => task,
    rooms: room => room
};

// Read
app.get('/:collection', ({username, password, params}, res) => {
    connect(username, password)
        .then(({db, client}) => db.collection(params.collection).find({}).toArray((err, result) => {
            client.close();

            res.json(result.map(COLLECTION_TRANSFORMS[params.collection]));
        }))
        .catch(err => res.status(400).send(err))
});

const EMPTY_TASK = {
    name:            '',
    room:            '',
    description:     '',
    isDeep:          false,
    weight:          1,
    history:         [],
    userLastCleaned: '',
    timeLastCleaned: 0
};

// Create
app.post('/tasks', ({username, password, body}, res) => {
    connect(username, password)
        .then(({db, client}) => db.collection('tasks')
            .insertOne(EMPTY_TASK, (err, result) => {
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

// Update
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

// Delete
app.delete('/tasks/:id', ({username, password, params, body}, res) => {
    connect(username, password)
        .then(({db, client}) => db.collection('tasks')
            .deleteOne({_id: ObjectID(params.id)}, (err, result) => {
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