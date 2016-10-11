import { CalendarEvent } from "./calendar";

import moment from "moment";


export class Welcome {

    private events: CalendarEvent[] = [
    ];

    private selectedDate = moment("2015-02-01").toDate();


    private newGuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public addEvent() {
        let since = this.getRandomIntInclusive(1, moment(this.selectedDate).daysInMonth());
        let till = this.getRandomIntInclusive(since, moment(this.selectedDate).daysInMonth());
        this.events.push(new CalendarEvent(since, till, this.newGuid()));
    }

    constructor() {

    }
}