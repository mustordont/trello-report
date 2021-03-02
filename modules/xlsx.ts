import * as XLSX from 'xlsx';

// const data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]

export function saveReport(data: any[][]): void {
    /* original data */
    const filename = `./dist/webapps_report_${new Date().toLocaleDateString()}.xlsx`;
    const ws_name = new Date().toLocaleDateString();
    const wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(data);

    /* add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);

    /* write workbook */
    XLSX.writeFile(wb, filename);

    console.log(`Report created: ${filename}`);
}
