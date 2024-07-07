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
  errorMessage: any;
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
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  login() {
    const userData = { "email": this.email };
    this.backendService.login(userData)
      .subscribe(
        response => {
                    console.log("responseUser",response)
          // Compare the hashed password from the server with the password entered by the user
          const isPasswordValid = compareSync(this.password, response.hashedPassword);
          if (isPasswordValid) {
            // Save user details in localStorage or session storage

            this.cookieService.set('currentUserId', response.email,{expires:1,sameSite:'Strict'});
             // Redirect or perform other actions
          this.router.navigate(['/dashboard']);
          this.getLocation();
          // Handle successful login response
          console.log('Logged in successfully!', response);
          this.sharedService.setData(response);
          //Get user location if logged in
          console.log("User", this.locationData);
          }else{
            throw Error;
          }
         
     
        },
        error => {
          // Handle login error
          // Display error message or perform other actions
          this.errorMessage = error.error;
          //time out to claer error message
          setTimeout(() => {
            this.errorMessage = '';
          }, 3500);
        }
      );
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

