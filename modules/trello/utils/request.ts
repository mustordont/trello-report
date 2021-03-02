const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

import fetch from 'node-fetch';
import {ICard} from '../card.interface';
import {CustomFieldModel, ICustomFieldValue} from './custom-field.model';
const PREFIX: string = 'https://api.trello.com/1';

function request<T=any>(url: string): Promise<T> {
    console.log(`Request: ${url}`);
    return fetch(
        `${PREFIX}${url}?key=${key}&token=${token}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }
    )
    .then(response => {
        console.log(
            `Response: ${response.status} ${response.statusText}`
        );
        return response.json();
    })
}

export async function grabTrelloBoardData(boardId: string, donelistId: string): Promise<ICard[]> {
    CustomFieldModel.DEFINITION = await request(`/boards/${boardId}/customFields`)
        .then((result) => {
            console.log('customFields', result);
            return result;
        })
        .catch(err => console.error(err))


    const cards: ICard[] = await request(`/lists/${donelistId}/cards`);

    const result: ICard[] = await Promise.all(
        cards.map(i => request(`/cards/${i.id}/customFieldItems`)
            .then((resultFields: ICustomFieldValue[]) => {
                i['customFields'] = resultFields.map(i => new CustomFieldModel(i));
                return i;
            })
        )
    )
        .catch(err => {
            console.error(err);
            return [];
        });

    return result;
}
