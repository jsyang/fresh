function checkIsSingle(number, string) {
    let result = number + ' ' + string;

    if (number > 1) {
        result += 's';
    }

    return result;
}

export const PERIOD     = 14;
export const DAY_FACTOR = 1 / (1000 * 60 * 60 * 24);

export const getIsOverDue = (time: number) => (Date.now() - time) * DAY_FACTOR > 2 * PERIOD;

export function getRelativeHumanString(date: number) {
    const then = new Date(date);
    const now  = new Date();
    let result = '';

    if ((now.getTime() - then.getTime()) * DAY_FACTOR > 365) {
        result = checkIsSingle(now.getFullYear() - then.getFullYear(), 'year');
    } else if ((now.getTime() - then.getTime()) * DAY_FACTOR > 30) {
        result = checkIsSingle(Math.round((now.getTime() - then.getTime()) * DAY_FACTOR / 30), 'month');
    } else if (Math.round((now.getTime() - then.getTime()) * DAY_FACTOR) >= 1) {
        result = checkIsSingle(Math.round((now.getTime() - then.getTime()) * DAY_FACTOR), 'day');
    } else if (now.getHours() > then.getHours()) {
        result = checkIsSingle(now.getHours() - then.getHours(), 'hour');
    } else if (now.getMinutes() > then.getMinutes()) {
        result = checkIsSingle(now.getMinutes() - then.getMinutes(), 'minute');
    } else if (now.getSeconds() > then.getSeconds()) {
        result = checkIsSingle(now.getSeconds() - then.getSeconds(), 'second');
    } else {
        result = 'Just now';
    }

    return result;
}