import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SignupComponent } from './components/signup/signup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TableViewComponent } from './components/table-view/table-view.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import {NgxTypedJsModule} from 'ngx-typed-js';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ConfigrationComponent } from './components/configration/configration.component';
import { NgxPrintModule } from 'ngx-print';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MainDashboardComponent,
    TableViewComponent,
    SideNavComponent,
    ConfigrationComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule, 
    MatFormFieldModule,
    MatInputModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgxTypedJsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    NgxPrintModule,
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})

export class AppModule { }
