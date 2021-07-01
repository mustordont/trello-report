import {CustomFieldModel, ICard, TrelloCard} from '../index';

export interface IReportSheet {
    label: string;
    data: any[][];
}

export class TrelloParser {
    cards: TrelloCard[] = [];
    listNames: string[] = [];
    reportStartDate: Date;
    reportFinishDate: Date;

    constructor(cards: ICard[]) {
        this.cards = cards.map(i => new TrelloCard(i));
    }

    public makeGeneralReport(): IReportSheet {
        const result: any[][] = [];
        result.push([
            'card name', 'link', ...CustomFieldModel.DEFINITION.map(i => i.name)
        ]);

        result.push(
            ...this.cards.map((card: TrelloCard) => {
                const mappedCustomFieldsValues: any[] = CustomFieldModel.DEFINITION.map(i => {
                    const value = card.customFields.find(j => i.id === j.id);
                    return value?.value;
                });

                card.records.forEach(i => {
                    if (!this.listNames.includes(i.title)) {
                        this.listNames.push(i.title);
                    }
                });

                if (!card.records.length) {
                    return [card.name, card.shortUrl];
                }

                const [created, ...dateLists] = card.records;

                const orderedCardLists = this.listNames.map((title) => {
                    return dateLists.find(i => i.title === title)?.value ?? '';
                });

                if (!this.reportStartDate || this.reportStartDate > created.date) {
                    this.reportStartDate = created.date;
                }

                const doneDate: Date = dateLists[dateLists.length-1]?.date
                if (!this.reportFinishDate || this.reportFinishDate < doneDate) {
                    this.reportFinishDate = doneDate;
                }

                return [
                    card.name, card.shortUrl, ...mappedCustomFieldsValues,
                    // maps to fields below
                    created.date, doneDate, card.desc, ...orderedCardLists
                ];
            })
        );
        // add the reported list names
        result[0].push('Created:', 'Finished:', 'Description', ...this.listNames.map(i => i.replace('Done 🚀', '')));

        return {
            label: new Date().toLocaleDateString(),
            data: result,
        };
    }

    public makeCDFReport(): IReportSheet {
        const result: any[][] = [];
        result.push(['Date', ...this.listNames]);

        for(const currentDate = this.reportStartDate; currentDate < this.reportFinishDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const dayResult: any[] = [currentDate.toLocaleDateString()];
            for(const list of this.listNames) {
                const cardsCount = this.cards.reduce((acc, item) => {
                    const index = item.records.findIndex(i => i.title === list);
                    if (index > 0 && item.records[index - 1].date <= currentDate && currentDate <= item.records[index].date) {
                        return ++acc;
                    } else {
                        return acc;
                    }
                }, 0);
                dayResult.push(cardsCount);
            }
            result.push(dayResult);
        }
        return {
            label: 'CFD',
            data: result,
        };
    }
}

export function makeTrelloReport(cards: ICard[]): IReportSheet[] {
    const report: IReportSheet[] = [];
    const parser: TrelloParser = new TrelloParser(cards);
    report.push(parser.makeGeneralReport());
    report.push(parser.makeCDFReport());

    return report;
}
