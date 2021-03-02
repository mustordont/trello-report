import {saveReport, makeTrelloReport, ICard, CustomFieldModel} from './modules';
import {grabTrelloBoardData} from './modules/trello/utils';

// const cards = cardsWithCustomFields as unknown as ICard[];
// CustomFieldModel.DEFINITION = customFields as any;

// can be found at https://trello.com/b/mI5tRXlR => https://trello.com/b/mI5tRXlR.json

const webAppsBoard = process.env.WEBAPPS_BOARD_ID;
const doneList = process.env.DONE_LIST_ID;

(async function() {
    // mocks
    // const cards = cardsWithCustomFields as unknown as ICard[];
    // CustomFieldModel.DEFINITION = customFields as any;

    const cards = await grabTrelloBoardData(webAppsBoard, doneList);

    const report: any[][] = makeTrelloReport(cards);
    saveReport(report);
})();
