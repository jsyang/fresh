const {fetchFromDB, POST_OPTIONS} = require('./networkUtils');

const {readFileSync} = require('fs');

// https://docs.mlab.com/data-api/#commands

const TASKS = ((csv) => {
    const lines   = csv.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(l => {
        const obj = {};

        l.split(',').forEach((v, i) => obj[headers[i]] = v);

        // Coerce values so not everything is a string
        obj.isDeep          = obj.isDeep === 'true';
        obj.weight          = parseFloat(obj.weight);
        obj.timeLastCleaned = parseFloat(obj.timeLastCleaned);
        obj.history         = obj.history || [];

        return obj;
    });
})(readFileSync(__dirname + '/tasks.csv').toString());

// Seed with initial data
Promise.all([
    ...('Delyth,Jim,Admin'.split(',').map(item =>
        fetchFromDB('/collections/users',
            {...POST_OPTIONS, body: JSON.stringify({name: item})}
        )
    )),
    ...('Kitchen,Lounge,Hall,Bathroom,Bedroom,Sicheng'.split(',').map(item =>
        fetchFromDB('/collections/rooms',
            {...POST_OPTIONS, body: JSON.stringify({name: item})}
        )
    )),
    ...(TASKS.map(item =>
        fetchFromDB('/collections/tasks',
            {...POST_OPTIONS, body: JSON.stringify(item)}
        )
    ))
])
    .then(() => console.log('Upserted seed data into DB!'));
