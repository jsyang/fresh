const {MongoClient} = require('mongodb');

function connect(username, password) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(`mongodb://${username}:${password}@${process.env.DB_HOST}`, (err, client) => {
            if (err) {
                reject(err);
            } else {
                resolve({db: client.db('fresh'), client});
            }
        });
    })
}

module.exports = {connect};