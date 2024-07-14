import { Component } from '@angular/core';
import { SharedService } from '../../service/shared-data.service';
import {CookieService} from 'ngx-cookie-service'


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {
  constructor(private sharedService:SharedService, private cookieService:CookieService){}
  username:any;
  MonthlyReport:any={
    noOfOrders:250,
    totalEarning:90000,
    AvgOrder: 3070,
  }
  dailyReport:any={
    noOfOrders:50,
    totalEarning:10000,
    AvgOrder: 200,
  }
 
  ngOnInit() {

    
    const loggedInUser=JSON.parse(this.cookieService.get('currentUserId'));
    this.sharedService.setData(loggedInUser);
    console.log(loggedInUser)
    this.username = this.extractUsername(loggedInUser.email);
  

  }
  getData() {
    return this.sharedService.getData();
  }
   extractUsername(email:any) {
    // Find the position of the "@" symbol
    const atIndex = email.indexOf('@');
    
    // If "@" symbol exists
    if (atIndex !== -1) {
      // Extract the substring before the "@" symbol
      const username = email.slice(0, atIndex);
      return username;
    } else {
      // Return the original email if "@" symbol is not found
      return email;
    }
  }
  logout() {
    sessionStorage.clear();
    location.reload();
    localStorage.clear();
    this.cookieService.deleteAll();
  }
 
}
