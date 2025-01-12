import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../../service/main-app.service';
//import { every } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../../service/shared-data.service';
import {compareSync} from 'bcryptjs';
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})

export class LoginComponent {
  form: FormGroup = new FormGroup({});
  password: any;
  email: any;
  location: any;
  response: any = '';
  errorMessage: any ={};
  constructor(private backendService: BackendService,
     private formBuilder: FormBuilder,private router: Router,
     private sharedService:SharedService,
     private cookieService:CookieService,
     ) {
    this.createForm();
  }

  validationMessage: any;
  locationData: any;
  strings = ['I\'m Programmer', 'IOS/Android Developer', 'Freelancer', 'Photographer'];
  options = {
    typeSpeed: 50,
    backSpeed: 50,
    backDelay: 500,
    loop: true,
  };
  ngOnInit() {
    this.getLocation();
    //dynaic images background
 
  }

  //  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  createForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(4)],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login() {
    const userData = { email: this.email, password: this.password };
  
    this.backendService.login(userData).subscribe({
      next: (response) => {
        console.log('Login Response:', response);
  
        if (response.status === 'success') {
          console.log('Login successful!');
          
          // Extract the token and user details from the response
          const authToken = response.token;
          const user = response.user;
  
          // Save the authentication token in cookies
          this.cookieService.set('authToken', authToken, {
            expires: 2, // Expires in 2 days
            sameSite: 'Strict',
          });
  
          // Save user data in cookies
          this.cookieService.set('currentUser', JSON.stringify(user), {
            expires: 1, // Expires in 1 day
            sameSite: 'Strict',
          });
  
          // Redirect to the dashboard
          this.router.navigate(['/dashboard']);
  
          // Share user data globally using shared service
          this.sharedService.setData(user);
  
          console.log('User details saved:', user);
        } else {
          // Handle unexpected responses
          this.setErrorMessage('Unexpected error occurred. Please try again.');
          console.error('Unexpected login response:', response);
  
          setTimeout(() => {
            this.clearErrorMessage();
          }, 3500);
        }
      },
      error: (error) => {
        console.log('API Error:', error);
  
        // Handle errors returned from the API
        const errorMsg = error.error?.message || 'An unknown error occurred.';
        this.setErrorMessage('Login failed. ' + errorMsg);
  
        // Clear the error message after a timeout
        setTimeout(() => {
          this.clearErrorMessage();
        }, 3500);
      },
    });
  }


  // Helper to set error messages
setErrorMessage(message: string) {
  if (!this.errorMessage) {
    this.errorMessage = { error: '' };
  }
  this.errorMessage.error = message;
}

// Helper to clear error messages
clearErrorMessage() {
  if (this.errorMessage) {
    this.errorMessage.error = '';
  }
}


  getLocation() {
    let locationData: { latitude: number, longitude: number, accuracy: number } | null = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.setLocation(locationData);
        },
        (error) => {
          console.error('Error getting location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  setLocation(location: any) {
    this.locationData = location;
    console.log("test", this.locationData)
  }

  onEmailChange(event: any) {
    this.email = event.target.value;
  }
  onPasswordChange(event: any) {
    console.log(event)
    this.password = event.target.value
  }

}

