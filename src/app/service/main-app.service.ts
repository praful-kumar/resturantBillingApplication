import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import {CookieService} from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class BackendService {
//   private baseUrl = 'http://localhost:9092';
    private baseUrl =  'https://restaurant-billing-production.up.railway.app';
  userLocation: { latitude: number; longitude: number } | null = null;

  isAuthenticated = false;

  constructor(private http: HttpClient, private cookieService:CookieService) {}

  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/api/users/signin`, data);
  // }
  //for routes protection
  isLoggedIn() {
    return  !!this.cookieService.get('authToken');
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/users/signin`, data).pipe(
      tap(() => {
        // Set isAuthenticated to true upon successful login
        const authToken = 'exampleAuthToken'; // Replace this with your actual token
        this.cookieService.set('authToken', authToken, { expires: 2, sameSite: 'Strict' });
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized access here, e.g., redirect to login page or show an error message
          console.error('Unauthorized access',error.error.error);
        }
        return throwError(() => error);
      })
    );
  }
  // signUp(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/signup`, data);
  // }

  async signUp(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/api/users/register`, data).toPromise();
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        throw  error.error;
      }
      // Handle error (e.g., log, throw, etc.)
      throw  error;
    }
  }

  setUserLocation(latitude: number, longitude: number): void {
    this.userLocation = { latitude, longitude };
  }

  getUserLocation(): { latitude: number, longitude: number } | null {
    return this.userLocation;
  }

 async setNewMenu(userId:any,data:any){
  const response = await this.http.post(`${this.baseUrl}/api/menu/saveMenu?userId=${userId}`, data).toPromise();
  return response;
  }

  async getMenus(): Promise<any> {
    console.log("best")
    return await this.http.get(`${this.baseUrl}/api/menu/getAllMenu`).toPromise();
  }

  async storeOders(orderDetails:any, userId:any):Promise<any> {


    return await this.http.post(`${this.baseUrl}/api/orders/storeOrders?userId=${userId}`,orderDetails ).toPromise();
  }

  async getOrders(): Promise<any> {
    console.log("best")
    return await this.http.get(`${this.baseUrl}/api/orders/getOrders`).toPromise();
  }

  // fetchData() {
  //   const headers = new HttpHeaders({
  //     'X-RapidAPI-Key': 'efbfd7d56emsha6167adf120a2edp1c0d94jsncd24a45d9b1a',
  //     'X-RapidAPI-Host': 'menu-restaurnt.p.rapidapi.com',
  //     'Access-Control-Allow-Credentials': 'true',
  //     'Access-Control-Allow-Origin': '*',
  //     'Cache-Control': 'no-cache, no-store'
  //   });

  //   return this.http.get('https://menu-restaurnt.p.rapidapi.com/', { headers });
  // }


}
