import {Provider} from '@angular/core';
import {UserService} from './lib/auth/user.service';
import {SneatTeamApiService} from './lib/sneat-team-api.service';
import {AnalyticsService} from './lib/analytics/analytics.interface';
import {FireAnalyticsService} from './lib/analytics/fire-analytics.service';
import {ErrorLogger} from './lib/logging/error-logger.interface';
import {ErrorLoggerService} from './lib/logging/error-logger.service';
import {Toaster} from './lib/ui/toaster.interface';
import {ToasterService} from './lib/ui/toaster.service';

export const sneatUiCoreProviders: Provider[] = [
	{provide: ErrorLogger, useClass: ErrorLoggerService},
	{provide: AnalyticsService, useClass: FireAnalyticsService},
	{provide: Toaster, useClass: ToasterService},
	UserService,
	SneatTeamApiService,
];
