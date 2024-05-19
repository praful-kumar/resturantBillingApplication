import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component'
import{MainDashboardComponent} from './components/main-dashboard/main-dashboard.component'
import{TableViewComponent} from './components/table-view/table-view.component'
import{SideNavComponent} from './components/side-nav/side-nav.component'
import { AuthGuardService } from './service/auth-guard.service';
import {ConfigrationComponent} from './components/configration/configration.component'

import {LoginGuard} from './service/login-guard.service'



const routes: Routes = [
  { path: 'login', component: LoginComponent,canActivate:[LoginGuard] },
  { path: 'signup', component: SignupComponent,canActivate:[LoginGuard] },
  { path: 'dashboard', component: SideNavComponent,canActivate: [AuthGuardService] },
  { path: 'table-sale', component:SideNavComponent ,canActivate: [AuthGuardService] },
  { path: 'configration', component:SideNavComponent ,canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Redirect to login page for any other invalid routes
  // Other routes
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
