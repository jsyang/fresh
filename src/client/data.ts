function setValuesAsKeys(obj) {
    Object.keys(obj).forEach(key => obj[key] = key);
}

export const USERS = {
    Delyth: '',
    Jim:    ''
};

export const ROOMS = {
    Kitchen:  '',
    Lounge:   '',
    Hall:     '',
    Bathroom: '',
    Bedroom:  '',
    Sicheng:  ''
};

// Set ids to strings
setValuesAsKeys(USERS);
setValuesAsKeys(ROOMS);

export interface ITask {
    room: string;
    description: string;
    isDeep?: true;
}

export const TASKS: ITask[] = [
    {
        room:        ROOMS.Kitchen,
        description: 'Scrub surfaces'
    },
    {
        room:        ROOMS.Kitchen,
        isDeep:      true,
        description: 'Remove the stove grills and scrub the stove surface'
    }
];