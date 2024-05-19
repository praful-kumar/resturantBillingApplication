import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/service/shared-data.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('menuAnimation', [
      state('open', style({
        width: '200px',
        overflow: 'hidden',
      })),
      state('closed', style({
        width: '0',
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('4s')
      ]),
    ]),
      trigger('fadeInOut', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('0.4s ease-out', style({ opacity: 1 })),
        ]),
        transition(':leave', [
          animate('0.3s ease-in', style({ opacity: 0 }))
        ])
      ])
    
  ]
  
})
export class SideNavComponent {

  receivedData: any;
  private readonly delayDuration = 200;
  constructor(private sharedService:SharedService, private elementRef: ElementRef,private router:Router){}
  inputData:any;
  showFiller = false;
  hideMenu = false;
  menuState = 'open';
  shouldRun = true;
  currentUrl:any;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  ngOnInit() {
    this.currentUrl = this.router.url;
    console.log("url", this.currentUrl)
  }
  getData() {
    return this.sharedService.getData();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const boundaryOffset = 50; // Adjust this value as needed
    if (event.clientX < boundaryOffset && !this.hideMenu) {
      this.hideMenu = true;
    }
    if (event.clientX > boundaryOffset && this.hideMenu) {
      this.hideMenu = false;
    }

  }

  navigateToTableSale(){
    this.router.navigate(['/table-sale']);
  }
}
