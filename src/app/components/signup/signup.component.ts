import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../../service/main-app.service';
import { Router } from '@angular/router';
import { genSaltSync, hashSync } from 'bcryptjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup = new FormGroup({});
  email: any;
  password: any;
  errorMessage: any;

  constructor(private backendService: BackendService,
    private formBuilder: FormBuilder, private router: Router,

  ) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(4)],
      email: ['', [Validators.required, Validators.email]]
    });
  }


  onEmailChange(event: any) {
    this.email = event.target.value;
  }
  onPasswordChange(event: any) {
    console.log(event)
    this.password = event.target.value
  }

  async register(): Promise<void> {
    const salt = genSaltSync(10);
  //  const pass = hashSync(this.password, salt);
    let userData: any = { "email": this.email, "password": this.password }
    try {
      const response = await this.backendService.signUp(userData)
      this.router.navigate(['/login']);
      console.log('Sign Up Response:', response);
      // Handle success response here
    } catch (error) {
      this.errorMessage = error
      console.error('Sign Up Error:', error);
      //time out to claer error message
      setTimeout(() => {
        this.errorMessage = '';
      }, 3500);
    }
  }

}
