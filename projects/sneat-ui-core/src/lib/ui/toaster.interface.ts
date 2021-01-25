import {InjectionToken} from '@angular/core';

export interface IToaster {
	showToast(message: string, duration?: number): void;
}

export const Toaster = new InjectionToken<IToaster>('IToaster');
