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

	getTimeMinutesDiff(dateTime: DateTime): Duration {
		if(dateTime){
			const date = DateTime.fromISO(dateTime.toString());   
			const diff = DateTime.now().diff(date, ["minutes"]);
			return diff;
		}
	
		return this.getDateTimeNow().diff(this.getDateTimeNow(), ["minutes"]);
	}
}