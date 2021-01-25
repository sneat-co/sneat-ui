import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';

const userIsNotAuthenticatedNoFirebaseToken = 'User is not authenticated yet - no Firebase ID token';

@Injectable()
export class SneatTeamApiService {

	private baseUrl = 'https://api.sneat.team/v0/';

	private firebaseIdToken?: string;

	constructor(
		private readonly httpClient: HttpClient,
		readonly afAuth: AngularFireAuth,
	) {
		afAuth.idToken.subscribe(idToken => {
			// console.log('SneatTeamApiService => new Firebase token:', idToken);
			if (idToken) {
				this.setFirebaseToken(idToken);
			} else {
				this.firebaseIdToken = undefined;
			}
		});
	}

	// TODO: It's made public because we use it in Login page, might be a bad idea consider making private and rely on afAuth.idToken event
	public setFirebaseToken(token: string): void {
		this.firebaseIdToken = token;
	}

	public post<T>(endpoint: string, body: any): Observable<T> {
		const url = this.baseUrl + endpoint;
		return this.errorIfNotAuthenticated() || this.httpClient
			.post<T>(
				url,
				body,
				{
					headers: this.headers(),
				}
			);
	}

	public put<T>(endpoint: string, body: any): Observable<T> {
		return this.errorIfNotAuthenticated() || this.httpClient
			.put<T>(
				this.baseUrl + endpoint,
				body,
				{
					headers: this.headers(),
				}
			);
	}

	public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return this.errorIfNotAuthenticated() || this.httpClient
			.get<T>(
				this.baseUrl + endpoint,
				{
					headers: this.headers(),
					params,
				}
			);
	}

	public getAsAnonymous<T>(endpoint: string, params?: HttpParams): Observable<T> {
		return this.httpClient
			.get<T>(
				this.baseUrl + endpoint,
				{
					params,
				}
			);
	}

	public delete<T>(endpoint: string, params: HttpParams): Observable<T> {
		return this.errorIfNotAuthenticated() || this.httpClient.delete<T>(this.baseUrl + endpoint, {
			params,
			headers: this.headers(),
		});
	}

	private errorIfNotAuthenticated(): Observable<never> | undefined {
		return !this.firebaseIdToken && throwError(userIsNotAuthenticatedNoFirebaseToken) || undefined;
	}

	private headers(): HttpHeaders {
		let headers = new HttpHeaders();
		if (this.firebaseIdToken) {
			headers = headers.append('X-Firebase-Id-Token', this.firebaseIdToken);
		}
		return headers;
	}
}
