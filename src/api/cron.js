const {connect} = require('./mongoClient');

const DAY_FACTOR = 1 / (1000 * 60 * 60 * 24);

const sortByLastCleaned = (a, b) => a.timeLastCleaned - b.timeLastCleaned;

const getPriorityTasksMessage = (priorityTasks) => `These tasks are building up!\n\n${priorityTasks.map(t =>
    `-- ${t.daysSinceLastClean} days since last "${t.name}"`
).join('\n')}`;

let connectedClient;
connect('fresh', 'read0nly')
    .then(({db, client}) => {
        connectedClient = client;

        db.collection('tasks').find({}).toArray((err, result) => {
            if (err) throw err;

            const now = Date.now();

            const priorityTasks = result
                .filter(t => (now - t.timeLastCleaned) * DAY_FACTOR > 5)
                .map(t => ({
                    ...t,
                    daysSinceLastClean: ((now - t.timeLastCleaned) * DAY_FACTOR).toFixed(2)
                }))
                .sort(sortByLastCleaned);

            console.table(priorityTasks, ['name', 'daysSinceLastClean']);

            connectedClient.close();
        });
    })
    .catch(err => console.error(err));
