interface ITask {
    // mongodb specific
    _id?: any;

    name: string;
    room: string;
    description: string;
    isDeep: boolean;
    weight: number;
    history: any[];
    userLastCleaned: string;
    timeLastCleaned: number;
}
