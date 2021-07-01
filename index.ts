require('dotenv').config();

import {saveReport, makeTrelloReport, ICard, CustomFieldModel, IReportSheet} from './modules';
import {grabTrelloBoardData} from './modules/trello/utils';
import * as cardsWithCustomFields from './dist/mocks/cards-with-custom-fields.json';
import * as customFields from './dist/mocks/custom-fields.json';

// can be found at https://trello.com/b/mI5tRXlR => https://trello.com/b/mI5tRXlR.json

const webAppsBoard = process.env.WEBAPPS_BOARD_ID;
const doneList = process.env.DONE_LIST_ID;

(async function() {
    // mocks
    // const cards = cardsWithCustomFields as unknown as ICard[];
    // CustomFieldModel.DEFINITION = customFields as any;

    const cards = await grabTrelloBoardData(webAppsBoard, doneList);

    const report: IReportSheet[] = makeTrelloReport(cards);
    saveReport(report);
})();
