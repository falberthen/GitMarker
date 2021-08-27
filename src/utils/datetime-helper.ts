import { injectable } from 'inversify';
import { DateTime, Duration } from 'luxon';

@injectable()
export class DateTimeHelper {

	formatDate(dateTime: DateTime) : string {
		const date = DateTime.fromISO(dateTime.toString());
		return date.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
	}
	
	getDateTimeNow() : DateTime {
		return DateTime.now();
	}
	
	getTimeDiff(dateTime: DateTime): Duration {
		const date = DateTime.fromISO(dateTime.toString());   
		return DateTime.now().diff(date, ["minutes"]);
	}
}