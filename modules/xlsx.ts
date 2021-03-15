import * as XLSX from 'xlsx';
import {IReportSheet} from './trello';

export function saveReport(data: IReportSheet[]): void {
    const filename = `./dist/webapps_report_${new Date().toLocaleDateString()}.xlsx`;
    const wb = XLSX.utils.book_new();

    for(const i in data) {
        // const data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
        const ws = XLSX.utils.aoa_to_sheet(data[i].data);
        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, data[i].label);
    }

    /* write workbook */
    XLSX.writeFile(wb, filename);

    console.log(`Report created: ${filename}`);
}
