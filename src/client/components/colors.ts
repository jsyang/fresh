// http://paletton.com/#uid=3000u0koBIPe3SHjNNxtUEiAwtp

import {DAY_FACTOR} from '../time';

export enum Color {
    Red0   = '#FF3B3B',
    Red1   = '#FF8F8F',
    Red2   = '#FF6161',

    Blue0  = '#2EC5C5',
    Blue1  = '#80E5E5',
    Blue2  = '#51D4D4',

    Green0 = '#B6F539',
    Green1 = '#D6FB8D',
    Green2 = '#C5F85F'
}

const PERIOD          = 7; // in days
const TWO_WEEK_FACTOR = 255 / PERIOD;

export const getBackgroundColorByTime = time => {
    const elapsedDays = Math.round(DAY_FACTOR * (Date.now() - time));

    if (elapsedDays >= 2 * PERIOD) {
        return `rgb(0,0,0)`;
    } else if (elapsedDays > PERIOD) {
        const r = Math.max(0, Math.min(255, elapsedDays * TWO_WEEK_FACTOR), 0);
        const g = Math.max(0, Math.min(255, (PERIOD - elapsedDays) * TWO_WEEK_FACTOR));

        return `rgb(${r},${g},0)`;
    } else {
        const r = Math.max(0, Math.min(255, elapsedDays * TWO_WEEK_FACTOR), 0);
        const g = Math.max(0, Math.min(255, (PERIOD - elapsedDays) * TWO_WEEK_FACTOR));

        return `rgb(${r},${g},0)`;
    }
};

export const getTextColorByTime = time => {
    const elapsedDays = DAY_FACTOR * (Date.now() - time);

    if (elapsedDays > PERIOD) {
        return `rgb(255,255,255)`;
    } else {
        const r = Math.max(0, Math.min(255, elapsedDays * TWO_WEEK_FACTOR), 0);
        const g = Math.max(0, Math.min(255, (PERIOD - elapsedDays) * TWO_WEEK_FACTOR));

        return `rgb(${g},255,${r})`;
    }
};
