// helper function to parse dates like 01.10.20
export function parseDate(value: any): Date | null {
    // We have no way using the native JS Date to set the parse format or locale, so we ignore these
    // parameters.
    if (!value) {
        return null;
    }
    if (typeof value === 'number') {
        return new Date(value);
    }
    let date: number = Date.parse(value.replace(/[\/.\s-]/g, '/').replace(/([0-9]+)(\/)([0-9]+)/, '$3$2$1'));
    if (isNaN(date)) {
        date = Date.parse(value);
    }
    return new Date(date);
}

export function dateDiff(first: Date, second: Date) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second.valueOf() - first.valueOf())/(1000*60*60*24));
}
