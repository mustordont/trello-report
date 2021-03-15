import {dateDiff, parseDate} from './utils';
import {ICustomField} from './utils/custom-field.model';

export interface ICard {
    id: string;
    name: string;
    desc: string;
    labels: string[];
    shortUrl: string;
    // populated data
    customFields?: ICustomField[];
}

export interface IReducedDateRecord {
    title: string;
    date: Date;
    value: Date | number;
}

export class TrelloCard implements ICard {
    id: string;
    name: string;
    desc: string;
    labels: string[] = [];
    shortUrl: string;

    customFields: ICustomField[] = [];
    records: IReducedDateRecord[] = [];

    constructor(data: ICard) {
        this.id = data.id;
        this.name = data.name;
        this.desc = data.desc;
        if (Array.isArray(data.labels)) {
            this.labels = data.labels;
        }
        this.shortUrl = data.shortUrl;
        if (Array.isArray(data.customFields)) {
            this.customFields = data.customFields;
        }

        const records: string[] = data.desc?.split('\n\n')[1]?.split('\n') ?? [];
        this.records = records.reduce((acc: IReducedDateRecord[], item: string) => {
            try {
                let dateString: string;
                if( item.includes(': ')) {
                    dateString = item.split(': ')[1];
                } else {
                    const date = item.match(/(\s\w+\s\d+,\s\d+$|\d+\.\d+\.\d+$)/);
                    if (date) {
                        dateString = date[0];
                    } else {
                        dateString = null;
                    }
                }
                const dateRecord: IReducedDateRecord = {
                    title: item.replace(dateString, ''),
                    date: parseDate(dateString),
                    value: !!acc.length ? dateDiff(acc[acc.length-1].date, parseDate(dateString)) : 0,
                };
                acc.push(dateRecord);
            } catch(e) {
                debugger
                console.error(e);
            }
            return acc;
        }, []);
    }
}

