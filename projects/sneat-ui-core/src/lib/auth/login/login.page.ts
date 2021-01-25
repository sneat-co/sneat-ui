// import {NavController, ToastController} from '@ionic/angular';
// @ts-ignore
import firebase from 'firebase/app';
import 'firebase/auth';
import {Component, Inject} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute} from '@angular/router';
import {ErrorLogger, IErrorLogger} from '../../logging/error-logger.interface';
import {RandomId} from '../../util/auto-id';
import {ILoginEventsHandler, LoginEventsHandler} from '../auth.interface';
import {AnalyticsService, IAnalyticsService} from '../../analytics/analytics.interface';
import {UserService} from '../user.service';
import {SneatTeamApiService} from '../../sneat-team-api.service';
import {IToaster, Toaster} from '../../ui/toaster.interface';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import OAuthProvider = firebase.auth.OAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import AuthProvider = firebase.auth.AuthProvider;
import UserCredential = firebase.auth.UserCredential;

type AuthProviderName = 'Google' | 'Microsoft' | 'Facebook' | 'GitHub';

type Action = 'join' | 'refuse'; // TODO: inject provider for action descriptions/messages.

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
})
export class LoginPage {

	public signingWith?: AuthProviderName | 'email' | 'emailLink' | 'resetPassword';
	public email = '';
	public password = '';
	public fullName = '';
	public to?: string;
	public action?: Action; // TODO: document possible values?
	public sign: 'in' | 'up' = 'up'; // TODO: document here what 'in' & 'up' means

	constructor(
		@Inject(AnalyticsService) private readonly  analyticsService: IAnalyticsService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(Toaster) private readonly toaster: IToaster,
		@Inject(LoginEventsHandler) private readonly loginEventsHandler: ILoginEventsHandler,
		private readonly route: ActivatedRoute,
		private readonly afAuth: AngularFireAuth,
		// private readonly navController: NavController,
		private readonly userService: UserService,
		// private readonly toastController: ToastController,
		private readonly sneatTeamApiService: SneatTeamApiService,
	) {
		this.email = localStorage.getItem('emailForSignIn') || '';
		if (this.email) {
			this.sign = 'in';
		}
		this.to = this.route.snapshot.queryParams.to; // should we subscribe? I believe no.
		const action = location.hash.match(/[#&]action=(\w+)/);
		this.action = action?.[1] as Action;
	}

	// @ViewChild('emailInput', {static: true}) emailInput: IonInput;

	public get validEmail(): boolean {
		const email = this.email, i = email?.indexOf('@');
		return i > 0 && i < email.length - 1;
	}

	ionViewDidEnter(): void {
		// this.setFocusToEmail();
	}

	signChanged(): void {
		// this.setFocusToEmail();
	}

	// private setFocusToEmail(): void {
	// 	this.emailInput.setFocus()
	// 		.catch(err => this.errorLoggerService.logError(err, 'Failed to set focus to email input'));
	// }

	loginWith(provider: AuthProviderName) {
		this.signingWith = provider;
		const eventParams = {authProvider: provider};
		let authProvider: AuthProvider;
		switch (provider) {
			case 'Google':
				authProvider = new GoogleAuthProvider();
				break;
			case 'Microsoft':
				authProvider = new OAuthProvider('microsoft.com');
				break;
			case 'Facebook':
				const fbAuthProvider = new FacebookAuthProvider();
				fbAuthProvider.addScope('email');
				authProvider = fbAuthProvider;
				break;
			case 'GitHub':
				const githubAuthProvider = new GithubAuthProvider();
				githubAuthProvider.addScope('read:user');
				githubAuthProvider.addScope('user:email');
				authProvider = githubAuthProvider;
				break;
			default:
				this.errorLogger.logError('Coding error', 'Unknown or unsupported auth provider: ' + provider);
				return;
		}
		this.analyticsService.logEvent('loginWith', eventParams);
		this.afAuth.signInWithPopup(authProvider)
			.then(userCredential => {
				this.analyticsService.logEvent('signInWithPopup', eventParams);
				this.onLoggedIn(userCredential);
			})
			.catch(this.handleError('Failed to sign in with: ' + provider, 'FailedToSignInWith', {authProvider: provider}));
	}

	public signUp(): void {
		if (!this.fullName) {
			this.toaster.showToast('Full name is required');
			return;
		}
		this.signingWith = 'email';
		this.email = this.email.trim();
		const errorLoggerService = this.errorLogger; // In case if page gets disposed by time we send verification email.
		this.afAuth.createUserWithEmailAndPassword(this.email, RandomId.newRandomId())
			.then(userCredential => {
				localStorage.setItem('emailForSignIn', this.email);
				setTimeout(() => {
					userCredential.user?.sendEmailVerification().catch(err => {
						errorLoggerService.logError(err, 'Failed to send verification email');
					});
				});
				userCredential.user?.getIdToken().then(token => {
					this.sneatTeamApiService.setFirebaseToken(token);
					this.userService.setUserTitle(this.fullName.trim()).subscribe({
						next: () => this.onLoggedIn(userCredential),
						error: err => {
							this.analyticsService.logEvent('FailedToSetUserTitle');
							this.errorLogger.logError(err, 'Failed to set user title', {feedback: false});
							this.onLoggedIn(userCredential);
						},
					});
				}).catch(this.handleError('Failed to get Firebase ID token', 'FirebaseGetIdTokenFailed'));
			})
			.catch(this.handleError('Failed to sign up with email', 'FailedToSignUpWithEmail'));
	}

	public keyupEnter(): void {
		switch (this.sign) {
			case 'in':
				this.signIn();
				break;
			case 'up':
				this.signUp();
				break;
		}
	}

	public signIn(): void {
		this.signingWith = 'email';
		this.email = this.email.trim();
		this.afAuth.signInWithEmailAndPassword(this.email, this.password)
			.then(userCredential => {
				// TODO: add analytics event
				this.onLoggedIn(userCredential);
			})
			.catch(this.handleError('Failed to sign in with email & password', 'email'));
	}

	public sendSignInLink(): void {
		this.signingWith = 'emailLink';
		this.email = this.email.trim();
		localStorage.setItem('emailForSignIn', this.email);
		this.afAuth.sendSignInLinkToEmail(this.email, {
			// url: 'https://dailyscrum.app/pwa/sign-in',
			url: document.baseURI + 'sign-in',
			handleCodeInApp: true,
		}).catch(this.handleError('Failed to send sign in link to email', 'FailedToSendSignInLinkToEmail'));
	}

	public resetPassword(): void {
		this.signingWith = 'resetPassword';
		this.afAuth.sendPasswordResetEmail(this.email)
			.then(() => {
				this.signingWith = undefined;
				// this.toastController.create({
				// 	message: `Password reset link has been sent to email: ${this.email}`,
				// }).then(toast => {
				// 	toast.present().catch(this.errorLogger.logErrorHandler('Failed to present toast about password reset email sent success'));
				// });
			})
			.catch(this.handleError('Failed to send password reset email', 'FailedToSendPasswordResetEmail'));
	}

	private onLoggedIn(userCredential: UserCredential): void {
		console.log('userCredential:', userCredential);
		if (userCredential.user) {
			this.userService.onUserSignedIn(userCredential.user);
		}
		const {to} = this.route.snapshot.queryParams;
		const queryParams = to ? {...this.route.snapshot.queryParams} : undefined;
		if (queryParams) {
			delete queryParams.to;
		}
		if (to) {
			// this.navController.navigateRoot(to, {queryParams, fragment: location.hash.substring(1)})
			// 	.catch(this.errorLogger.logErrorHandler('Failed to naviage to: ' + to));
		} else {
			this.loginEventsHandler.onLoggedIn();
		}
	}

	private handleError(m: string, eventName?: string, eventParams?: { [key: string]: string }): (err: any) => void {
		return err => {
			if (eventName) {
				this.analyticsService.logEvent(eventName, eventParams);
			}
			this.errorLogger.logError(err, m, {report: !err.code});
			this.signingWith = undefined;
		};
	}
}
