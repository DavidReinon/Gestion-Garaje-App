import { formatInTimeZone } from "date-fns-tz";

const formatToLocalTimeZoneString = (fecha: Date): string => {
    const timeZone = "Europe/Madrid";
    const finalDateString = formatInTimeZone(fecha, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    console.log(finalDateString);
    return finalDateString;
};

const manualFormatToLocalTimeZoneString = (fecha: string): string => {
    const defaultTime = "T00:00:00Z";

    const [day, month, year] = fecha.split("/").map(Number);
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}${defaultTime}`;
};

export default formatToLocalTimeZoneString;