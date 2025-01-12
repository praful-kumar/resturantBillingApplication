import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private baseUrl = 'http://localhost:9092';
  userLocation: { latitude: number; longitude: number } | null = null;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private userDetails: any = null;
  // Check if user is logged in using auth token from cookies
  isLoggedIn(): boolean {
    return !!this.cookieService.get('authToken');
  }  
  isAuthenticated = false;

  // Login API
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/signin`, data).pipe(
      tap(() => {
        // Actions to be taken on successful login
      }),
      catchError(this.handleError)
    );
  }



  // Sign-up API
  signUp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/register`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Save a new menu
  setNewMenu(userId: any, data: any): Observable<any> {
    const token = this.cookieService.get('authToken'); // Replace this with your token fetching logic
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/api/menu/saveMenu?userId=${userId}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch all menus
  getMenus(): Observable<any> {
    const token = this.cookieService.get('authToken'); // Retrieve token dynamically
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/menu/getAllMenu`).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch menus by user ID
  getMenusByUser(userId: any): Observable<any> {
    const token = this.cookieService.get('authToken'); // Fetch token from cookies
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/menu/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch orders by user ID with Authorization token
  getOrderByUser(userId: any): Observable<any> {
    const token = this.cookieService.get('authToken'); // Fetch token from cookies
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/orders/getOrders/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Store orders
  storeOrders(orderDetails: any, userId: any): Observable<any> {
    const token = this.cookieService.get('authToken'); // Fetch token from cookies
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/api/orders/storeOrders?userId=${userId}`, orderDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch all orders
  getOrders(): Observable<any> {
    const token = this.cookieService.get('authToken'); // Fetch token from cookies
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/orders/getOrders`).pipe(
      catchError(this.handleError)
    );
  }

  // Set user location
  setUserLocation(latitude: number, longitude: number): void {
    this.userLocation = { latitude, longitude };
  }

  // Get user location
  getUserLocation(): { latitude: number; longitude: number } | null {
    return this.userLocation;
  }

  // Error handler for HTTP requests
  private handleError(error: HttpErrorResponse): Observable<never> {
   
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.message}`;

    }
    console.error(errorMessage);
    return throwError(() => error);
  }
}

