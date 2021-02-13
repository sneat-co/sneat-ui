import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {Routes} from '@angular/router';
import {LoginPage} from './login/login.page';

export const routes: Routes = [
	{
		path: 'login',
		component: LoginPage,
		// ERROR: When building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option.
		// loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		// RouterModule.forChild(routes),
	],
	declarations: [
		LoginPage,
	],
	exports: [
		LoginPage,
	],
})
export class SeanTeamUiAuthModule {
}
