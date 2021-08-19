import { DateTime, Duration } from 'luxon';

export function formatDate(dateTime: DateTime) : string{
	const date = DateTime.fromISO(dateTime.toString());
	return date.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

export function getDateTimeNow() : DateTime {
	return DateTime.now();
}

export function getTimeDiff(dateTime: DateTime): Duration{
	const date = DateTime.fromISO(dateTime.toString());   
	return DateTime.now().diff(date, ["minutes"]);
}