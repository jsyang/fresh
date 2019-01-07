const {readFileSync} = require('fs');
const fetch          = require('node-fetch');

const ORIGIN  = 'https://api.mlab.com/api/1/databases/fresh';
const API_KEY = `?apiKey=${process.env.API_KEY}`;

const getURL = path => `${ORIGIN}${path}${API_KEY}`;

const POST_OPTIONS = { // Insert
    method:  'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};
const PUT_OPTIONS  = { // Replace
    method:  'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
};

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

Promise.all([
    // Clear out collections first
    fetch(getURL('/collections/users'), {...PUT_OPTIONS, body: '[]'}),
    fetch(getURL('/collections/rooms'), {...PUT_OPTIONS, body: '[]'}),
    fetch(getURL('/collections/tasks'), {...PUT_OPTIONS, body: '[]'})
])
    .then(() =>
        // Seed with initial data
        Promise.all([
            ...('Delyth,Jim'.split(',').map(u =>
                fetch(
                    getURL('/collections/users'),
                    {
                        ...POST_OPTIONS,
                        body: JSON.stringify({name: u})
                    }
                )
            )),
            ...('Kitchen,Lounge,Hall,Bathroom,Bedroom,Sicheng'.split(',').map(r =>
                fetch(
                    getURL('/collections/rooms'),
                    {
                        ...POST_OPTIONS,
                        body: JSON.stringify({name: r})
                    }
                )
            )),
            ...(TASKS.map(r =>
                fetch(
                    getURL('/collections/tasks'),
                    {
                        ...POST_OPTIONS,
                        body: JSON.stringify(r)
                    }
                )
            )),
        ])
    )
    .then(() => console.log('Seeded!'));
