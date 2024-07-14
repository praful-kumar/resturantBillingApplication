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
   

    this.currentUser = JSON.parse(this.cookieService.get('currentUserId'));
    console.log("loggedInUser", this.currentUser.Id)
    this.ordersData = new MatTableDataSource<any>(this.ordersData);
    this.ordersData.paginator = this.paginator;
    this.getAllmenus();
    this.getAllOrders();
   
  }

  async getAllmenus() {
    // await this.backendService.getMenus().then(data => {
    //   this.dataSource.data = data;
    //   this.nextMenuId = Number(data[data.length - 1].id) + 1
    //   console.log("test", this.allMenuList)
    // });
    await this.backendService.getMenusByUser(this.currentUser.Id).then((data => {
     // this.dataSource.data = data;
      try{
        const temp:any[] =[]
        if(data.length > 0){
          data.forEach((e:any, i:any) => {
            e.id = i+1;
            temp.push(e);
          });
          this.dataSource.data = temp;
          this.nextMenuId = Number(data[data.length - 1].id) + 1
          console.log('specificData', data)
        }
        else{
          throw Error
        }
      }catch{
        alert("No Menu added")
      }
      
   
    }
    ))
  }

  async getAllOrders() {
    await this.backendService.getOrderByUser(this.currentUser.Id).then(data => {
      this.ordersData = data.reverse();
    });
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

  addMenu(searchInput: any, quantityInput: any) {
   // this.menu.id = this.nextMenuId ? this.nextMenuId : 1;
    const userId = this.currentUser.Id;
    this.backendService.setNewMenu(userId, this.menu)
      .then(response => {
        console.log('Menu added successfully!', response);
        this.getAllmenus();
      })
      .catch(error => {
        console.error('Error adding menu:', error);
      })
    console.log("all Menus", this.menu);
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
