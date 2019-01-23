const {fetchFromDB, PUT_OPTIONS} = require('./networkUtils');

Promise.all([
    // Clear out collections first
    fetchFromDB('/collections/users', {...PUT_OPTIONS, body: '[]'}),
    fetchFromDB('/collections/rooms', {...PUT_OPTIONS, body: '[]'}),
    fetchFromDB('/collections/tasks', {...PUT_OPTIONS, body: '[]'})
])
    .then(() => console.log('DB has been reset!'));
