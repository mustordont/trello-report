require('dotenv').config();

import {CustomFieldModel, ICard} from '../index';
import {dateDiff, parseDate} from './utils';

interface IReducedDateRecord {
    title: string;
    date: Date;
    value: Date | number;
}

export function makeTrelloReport(cards: ICard[]): any[][] {
    const result: any[][] = [];
    result.push([
        'card name', 'link', ...CustomFieldModel.DEFINITION.map(i => i.name)
    ]);
    const listNames: string[] = [];

    result.push(
        ...cards.map(card => {
            const customFieldsValues: any[] = CustomFieldModel.DEFINITION.map(i => {
                const value = (card['customFields'] as CustomFieldModel[]).find(j => i.id === j.id);
                return value?.value;
            });
            const lists: string[] = card.desc?.split('\n\n')[1]?.split('\n') ?? [];
            const [created, ...dateLists] = lists.reduce((acc: IReducedDateRecord[], item: string) => {
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
                    if (!listNames.includes(dateRecord.title)) {
                        listNames.push(dateRecord.title);
                    }
                    acc.push(dateRecord);
                } catch(e) {
                    debugger
                    console.error(e);
                }
                return acc;
            }, []);
            const orderedCardLists = listNames.map((title) => {
                return dateLists.find(i => i.title === title)?.value ?? '';
            })
            return [
                card.name, card.shortUrl, ...customFieldsValues,
                // maps to fields below
                created.date, dateLists[dateLists.length-1]?.date, card.desc, ...orderedCardLists
            ];
        })
    );
    // add the reported list names
    result[0].push('Created:', 'Finished:', 'Description', ...listNames.map(i => i.replace('Done 🚀', '')));

    return result;
}
