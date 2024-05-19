import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BackendService } from './main-app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard {

  constructor(private loginGuard: BackendService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(this.loginGuard.isAuthenticated)
    if (this.loginGuard.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false; // Prevents accessing the login page if authenticated
    } else {
      return true; // Allow access to the login page if not authenticated
    }
  }
}
