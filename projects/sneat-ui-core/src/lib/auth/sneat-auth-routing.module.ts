import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginPage} from './login/login.page';
import {LoginPageModule} from './login/login.module';

const routes: Routes = [
	{
		path: 'login',
		component: LoginPage,
		// loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
	},
];

export const SneatAuthRoutingModule: NgModule = {
	imports: [
		LoginPageModule,
		RouterModule.forChild(routes),
	],
	exports: [RouterModule],
};
