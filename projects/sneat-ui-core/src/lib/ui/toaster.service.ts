import {ToastController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '../logging/error-logger.interface';
import {Inject, Injectable} from '@angular/core';
import {IToaster} from './toaster.interface';

const defaultDuration = 3000;

@Injectable()
export class ToasterService implements IToaster {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly toastController: ToastController,
	) {
	}

	public showToast(message: string, duration?: number): void {
		this.toastController.create({
			message,
			duration: duration || defaultDuration,
			keyboardClose: true,
			buttons: [{
				icon: 'close',
				side: 'end',
				handler: () => this.toastController.dismiss()
					.catch(this.errorLogger.logErrorHandler('Failed to dismiss toast', {show: false})),
			}],
			color: 'medium',
			position: 'middle',
		})
			.then(toast => toast.present().catch(this.errorLogger.logErrorHandler('Failed to present toast with  message')))
			.catch(this.errorLogger.logErrorHandler('Failed to create toast with message'));
	}
}
