import {Inject, Injectable} from '@angular/core';
import {ErrorLogger, IErrorLogger, ILogErrorOptions} from '../logging/error-logger.interface';
import {IAnalyticsCallOptions, IAnalyticsService} from './analytics.interface';
import {AngularFireAnalytics} from '@angular/fire/analytics';

const logErrOptions: ILogErrorOptions = {show: false, feedback: false};

@Injectable()
export class FireAnalyticsService implements IAnalyticsService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly angularFireAnalytics: AngularFireAnalytics,
	) {
	}

	public logEvent(eventName: string, eventParams?: { [key: string]: any; }, options?: IAnalyticsCallOptions): void {
		this.angularFireAnalytics
			.logEvent(eventName, eventParams, options)
			.catch(this.errorLogger.logErrorHandler('Failed to log analytics event', logErrOptions));
	}

	public setCurrentScreen(
		screenName: string,
		options?: IAnalyticsCallOptions,
	): void {
		this.angularFireAnalytics
			.setCurrentScreen(screenName, options)
			.catch(this.errorLogger.logErrorHandler('Failed to set analytics screen name', logErrOptions));
	}
}
