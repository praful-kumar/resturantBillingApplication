import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../service/main-app.service'
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service'
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-configration',
  templateUrl: './configration.component.html',
  styleUrls: ['./configration.component.scss']
})
export class ConfigrationComponent {

  constructor(private router: Router, private backendService: BackendService, private cookieService: CookieService, private dialog: MatDialog) { }
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  quantity: number = 0;
  menu: any = {
  //  id: '',
    name: '',
    price: ''
  }
  allMenuList: any[] = [];
  menuName: any;
  displayedColumns: string[] = ['id', 'name', 'price', 'action'];
  displayedMenuColumns: string[] = ['id', 'name', 'price', 'total'];

  dataSource = new MatTableDataSource<any>(this.allMenuList);
  // showSelectedTableMenu: any[] = [];


  ordersDetails: any = {
    tableId: '',
    totalAmount: '',
    showOrder: '',
    orderMenu: []

  }

  //selectedTableMenu = new MatTableDataSource<any>(this.ordersDetails.orderMenu)

  nextMenuId: number = 0;
  showTable: any;

  dummydata: any = [
    {
      "id": "66425df1a9d6e94e355096bc",
      "currentDateAndTime": "14/05/2024 12:07 AM",
      "menu": [
        {
          "id": "1",
          "name": "Kadhai Paneer",
          "price": 260,
          "quantity": 1,
          "totalPrice": 260
        }
      ],
      "tableId": 9,
      "user": null
    },
    {
      "id": "66425ea83b4ab8363d368ee1",
      "currentDateAndTime": "14/05/2024 12:10 AM",
      "menu": [
        {
          "id": "1",
          "name": "Kadhai Paneer",
          "price": 260,
          "quantity": 2,
          "totalPrice": 520
        },
        {
          "id": "2",
          "name": "Butter Tandoori Roti ",
          "price": 20,
          "quantity": 2,
          "totalPrice": 40
        }
      ],
      "tableId": 8,
      "user": null
    },
    {
      "id": "66425f603b4ab8363d368ee2",
      "currentDateAndTime": "14/05/2024 12:13 AM",
      "menu": [
        {
          "id": "2",
          "name": "Butter Tandoori Roti ",
          "price": 20,
          "quantity": 1,
          "totalPrice": 20
        }
      ],
      "tableId": 7,
      "user": null
    },
    {
      "id": "66426230be84fd107b767efe",
      "currentDateAndTime": "14/05/2024 12:25 AM",
      "menu": [
        {
          "id": "1",
          "name": "Kadhai Paneer",
          "price": 260,
          "quantity": 2,
          "totalPrice": 520
        }
      ],
      "tableId": 2,
      "user": null
    }
  ]

  ordersData: any;
  currentUser: any;
  orderLength: any;


  ngOnInit() {
   

    this.currentUser = JSON.parse(this.cookieService.get('currentUser'));
    console.log("loggedInUser", this.currentUser.id)
    this.ordersData = new MatTableDataSource<any>(this.ordersData);
    this.ordersData.paginator = this.paginator;
    this.getAllMenus();
    this.getAllOrders();
   
  }

  getAllMenus(): void {
    this.backendService.getMenusByUser(this.currentUser.id).subscribe({
      next: (data) => {
        try {
          const temp: any[] = [];
          if (data.length > 0) {
            data.forEach((e: any, i: number) => {
              e.id = i + 1; // Assign sequential IDs
              temp.push(e);
            });
            this.dataSource.data = temp; // Update the dataSource
            this.nextMenuId = Number(data[data.length - 1].id) + 1; // Determine the next menu ID
            console.log('specificData', data);
          } else {
            throw new Error('No menus available');
          }
        } catch (error) {
          alert("No Menu added");
        }
      },
      error: (err) => {
        console.error('Error fetching menus:', err);
        alert('An error occurred while fetching menus.');
      }
    });
  }
  

  async getAllOrders() {
    await this.backendService.getOrderByUser(this.currentUser.id).subscribe({ 
      next: (data) => {
      this.ordersData = data.reverse();
    }});
  }
  back(e: any) {
    this.router.navigate(['/dashboard']);
  }

  onKey(e: any) {
    this.menu.name = e.value;
  }

  onKeyPrice(quantityInput: any) {
    this.menu.price = quantityInput.value;
  }

  addMenu(searchInput: any, quantityInput: any): void {
    const userId = this.currentUser.id;
    this.backendService.setNewMenu(userId, this.menu).subscribe({
      next: (response) => {
        console.log('Menu added successfully!', response);
        this.getAllMenus(); // Refresh the menu list after adding
      },
      error: (error) => {
        console.error('Error adding menu:', error);
        alert('An error occurred while adding the menu.');
      }
    });
  
    console.log("All Menus", this.menu);
  
    // Clear input fields after adding the menu
    searchInput.value = '';
    quantityInput.value = '';
  }
  removeItem(e: any) {

  }

  showMenu(tableId: any, amount: number, index: number) {
    console.log(tableId, "__", index);
    this.ordersDetails.showOrder = tableId;
    this.ordersDetails.totalAmount = amount;
    this.ordersDetails.orderMenu = this.ordersData[index]?.menu;


  }
  closeTab() {
    this.ordersDetails.showOrder = '';
  }
}
