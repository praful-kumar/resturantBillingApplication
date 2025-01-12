import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { BackendService } from 'src/app/service/main-app.service';
import { SharedService } from 'src/app/service/shared-data.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent {
  @ViewChild('tableRstoredDataef')
  tableElement!: ElementRef<HTMLTableElement>;

  searchControl = new FormControl();
  filteredSuggestions: Observable<string[]>;
  constructor(private backendService: BackendService, private router: Router, private datepipe: DatePipe,
    //private sharedService:SharedService,public print: NgxPrintElementService
    private printService: NgxPrintService, private el: ElementRef, private cookieService: CookieService

  ) {
    this.filteredSuggestions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSuggestions(value))
    );
  }
  numberOfTables: number = 15;

  selected = "Option 2"
  suggestion: string[] = ['Apple', 'Banana', 'Orange', 'Mango'];
  menus: any[] = []
  // menus: any[] = [
  //   { id: 1, name: 'Butter Chicken', price: 10.99 },
  //   { id: 2, name: 'Palak Paneer', price: 9.99 },
  //   { id: 3, name: 'Chicken Tikka Masala', price: 11.99 },
  //   { id: 4, name: 'Chole Bhature', price: 8.99 },
  //   { id: 5, name: 'Biryani', price: 12.99 },
  //   { id: 6, name: 'Samosa', price: 4.99 },
  //   { id: 7, name: 'Naan', price: 2.99 },
  //   { id: 8, name: 'Dal Makhani', price: 9.99 },
  //   { id: 9, name: 'Paneer Tikka', price: 10.99 },
  //   { id: 10, name: 'Aloo Gobi', price: 8.99 },
  //   { id: 11, name: 'Rogan Josh', price: 11.99 },
  //   { id: 12, name: 'Matar Paneer', price: 9.99 },
  //   { id: 13, name: 'Pani Puri', price: 5.99 },
  //   { id: 14, name: 'Tandoori Chicken', price: 12.99 },
  //   { id: 15, name: 'Veg Biryani', price: 10.99 },
  //   { id: 16, name: 'Fish Curry', price: 13.99 },
  //   { id: 17, name: 'Gulab Jamun', price: 4.99 },
  //   { id: 18, name: 'Papdi Chaat', price: 6.99 },
  //   { id: 19, name: 'Raita', price: 3.99 },
  //   { id: 20, name: 'Pulao', price: 8.99 },
  //   { id: 21, name: 'Vegetable Korma', price: 10.99 },
  //   { id: 22, name: 'Chicken Biryani', price: 11.99 },
  //   { id: 23, name: 'Chana Masala', price: 8.99 },
  //   { id: 24, name: 'Pakora', price: 5.99 },
  //   { id: 25, name: 'Kadai Paneer', price: 11.99 },
  //   { id: 26, name: 'Bhindi Masala', price: 8.99 },
  //   { id: 27, name: 'Keema Naan', price: 4.99 },
  //   { id: 28, name: 'Malai Kofta', price: 10.99 },
  //   { id: 29, name: 'Aloo Paratha', price: 7.99 },
  //   { id: 30, name: 'Rasgulla', price: 4.99 },
  //   { id: 31, name: 'Pav Bhaji', price: 9.99 },
  //   { id: 32, name: 'Chaat Papdi', price: 6.99 },
  //   { id: 33, name: 'Chicken Curry', price: 11.99 },
  //   { id: 34, name: 'Dosa', price: 7.99 },
  //   { id: 35, name: 'Gobi Manchurian', price: 9.99 },
  //   { id: 36, name: 'Butter Naan', price: 3.99 },
  //   { id: 37, name: 'Mutton Curry', price: 13.99 },
  //   { id: 38, name: 'Lassi', price: 3.99 },
  //   { id: 39, name: 'Malai Chicken Tikka', price: 12.99 },
  //   { id: 40, name: 'Rajma Masala', price: 8.99 },
  //   { id: 41, name: 'Prawn Curry', price: 14.99 },
  //   { id: 42, name: 'Vegetable Pulao', price: 9.99 },
  //   { id: 43, name: 'Mango Lassi', price: 4.99 },
  //   { id: 44, name: 'Chilli Chicken', price: 11.99 },
  //   { id: 45, name: 'Puri', price: 6.99 },
  //   { id: 46, name: 'Chicken 65', price: 12.99 },
  //   { id: 47, name: 'Vegetable Biryani', price: 10.99 },
  //   { id: 48, name: 'Chapati', price: 1.99 },
  //   { id: 49, name: 'Chicken Korma', price: 12.99 },
  //   { id: 50, name: 'Fish Fry', price: 13.99 }
  // ];
  filteredMenus: any;
  selectedMenu: any[] = []
  dataSource = new MatTableDataSource<any>(this.selectedMenu)
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price', 'total price', 'action'];
  selectedTable: any;
  quantity: number = 0;
  tableDetails: any[] = []
  mainMenu: any;
  totalAmount: number = 0;
  discountPercent: any;
  discountPrice: number = 0;
  currentUser: any;
  ngOnInit() {
    // Retrieving data
    this.tableDetails = JSON.parse(localStorage.getItem('unbilled_data') || '[]');
    this.currentUser = JSON.parse(this.cookieService.get('currentUser'));
    console.log("loggedInUser", this.currentUser);
    this.getAllMenus();
  }

  async getAllMenus() {
    await this.backendService.getMenusByUser(this.currentUser.id).subscribe(data => {
      // Process the received data here
      try{
        if(data.length > 0){          
            data.forEach((e:any, i:any) => {
              e.id = i+1;
              this.menus.push(e);
            });
         // this.menus = data 
          console.log('specificData', data)
        }
        else{
          throw Error
        }
      }catch{
        alert("Please Add some menu before billing")
      }
    });
  }

  back(e: any) {
    this.router.navigate(['/dashboard']);

  }
  getTables(): number[] {
    return Array(this.numberOfTables).fill(0).map((x, i) => i + 1);
  }
  addTable() {
    this.numberOfTables = this.numberOfTables + 1;
  }
  onTableSelect(e: any) {
    this.selectedTable = e;
    const isTablePresent = this.isTablePresent(e);
    isTablePresent ? this.dataSource.data = this.getMenusforTable(this.selectedTable).menus : this.dataSource.data = [];
    console.log(' this.table_Details', this.tableDetails);
    this.discountPercent = '';
    this.calcTotalPrice();

  }
  onKey(e: any) {
    this.filteredMenus = this._filterSuggestions(e.value)
  }

  private _filterSuggestions(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.menus.filter(menu => {
      const menuName = menu.name.toLowerCase();
      const menuId = menu.id.toString(); // Convert menu ID to string for comparison

      // Check if either menu name or menu ID contains the filter value
      return menuName.includes(filterValue) || menuId.includes(filterValue);
    });
  }
  selectedMenuItem: any;
  onOptionSelected(e: MatAutocompleteSelectedEvent) {
    const selectedMenuName = e.option.value;
    this.selectedMenuItem = this.filteredMenus.find((menu: any) => menu.name === selectedMenuName);
  }
  onKeyQuantity(quantityInput: any) {
    this.quantity = parseInt(quantityInput.value);
  }
  addMenu(searchInput: any, quantityInput: any) {
    if (this.quantity && this.selectedMenuItem) {
      this.tableHandler(this.selectedMenuItem);
      searchInput.value = '';
      quantityInput.value = '';
      this.filteredMenus = [];
    }
  }



  removeItem(item: any) {
    const tableIndex = this.tableDetails.findIndex(table => table.table_id === this.selectedTable);
    if (tableIndex !== -1) {
      const table = this.tableDetails[tableIndex];
      const itemIndex = table.menus.findIndex((i: any) => i.id === item.id);
      if (itemIndex !== -1) {
        table.menus.splice(itemIndex, 1); // Remove item from tableDetails
        this.dataSource.data = this.dataSource.data.filter((dataItem: any) => dataItem.id !== item.id); // Remove item from dataSource
      }
    }
  }


  tableHandler(item: any) {
    const tableIndex = this.tableDetails.findIndex(table => table.table_id == this.selectedTable);
    if (tableIndex !== -1) {
      const existingItem = this.tableDetails[tableIndex].menus.find((i: any) => i.id === item.id);
      if (existingItem && this.tableDetails[tableIndex].table_id == this.selectedTable) {
        console.log(existingItem, 'existingItem')
        existingItem.quantity += this.quantity;
        existingItem.totalPrice = parseFloat((existingItem.totalPrice + (item.price * this.quantity)).toFixed(2));
      } else {
        this.addNewItemToTable(tableIndex, item, tableIndex);
      }
    } else {
      this.addNewItemToTable(-1, item, tableIndex);
    }
  }

  addNewItemToTable(index: number, newitem: any, tableIndex: any) {
    const item = JSON.parse(JSON.stringify(newitem));
    item.quantity = this.quantity;
    item.totalPrice = parseFloat((item.price * this.quantity).toFixed(2));

    if (index !== -1) {
      this.tableDetails[index].menus.push(item);
      // this.dataSource.data.push(item);
      // this.dataSource.data = [...this.dataSource.data ];
      // this.dataSource.data = this.getMenusforTable(this.selectedTable).menus
    } else {
      this.tableDetails.push({ 'table_id': this.selectedTable, 'menus': [item] });
      // this.dataSource.data = [...this.dataSource.data,item ];
      // this.dataSource.data = this.getMenusforTable(this.selectedTable).menus
    }
    this.dataSource.data = this.getMenusforTable(this.selectedTable).menus
    // Storing data
    localStorage.setItem('unbilled_data', JSON.stringify(this.tableDetails));

    this.calcTotalPrice();
  }

  getMenusforTable(tableId: any) {
    return this.tableDetails.find(table => table.table_id === tableId);
  }

  isTablePresent(tableId: any) {
    return this.tableDetails.some(obj => obj.table_id === tableId);
  }
  calcTotalPrice() {
    if (this.dataSource.data) {
      this.totalAmount = this.dataSource.data.reduce((accumulator, currentItem) => accumulator + currentItem.totalPrice, 0);
      console.log("totalP", this.totalAmount);
      this.discountPrice = this.totalAmount;

    }

  }
  async applyDiscount(e: any) {
    this.discountPercent = e.value;
    this.discountPrice = await this.calcDis(e.value);
  }
  async calcDis(discountPercent: number): Promise<number> {
    // Calculate the discount amount
    const discountAmount = (this.totalAmount * discountPercent) / 100;

    // Subtract the discount amount from the total amount to get the discounted price
    const discountPrice = this.totalAmount - discountAmount;

    console.log("Discounted price:", discountPrice);
    return discountPrice;
  }

  checkout() {
    const printContent = this.el.nativeElement.innerHTML;
    const iframe = document.getElementById('menuTable');
    if (iframe && this.totalAmount > 0) {
      const printOptions: PrintOptions = {
        printSectionId: 'menuTable',
        printTitle: 'Standarded 52 Cafe & Restro',
        useExistingCss: true,
        bodyClass: 'theme-dark',
        openNewTab: false,
        previewOnly: false,
        closeWindow: false,
        printDelay: 0
      };
      this.syncOrdertoDB(this.selectedTable);
      this.printService.print(printOptions);
      this.discountPrice = 0;
      this.discountPercent = '';
      const tableIndex = this.tableDetails.findIndex(table => table.table_id == this.selectedTable);
      console.log('tableIndex', tableIndex);
      this.tableDetails.splice(tableIndex, 1)
      console.log('tableData', this.tableDetails);
      this.dataSource.data = [];
      this.totalAmount = 0;
      localStorage.setItem('unbilled_data', JSON.stringify(this.tableDetails));



    } else {
      alert("Please select table first, total amount should be graeter then 0");
      console.error('Element with ID "menuTable" not found');
    }
  }

  syncOrdertoDB(tableId: any) {
    let syncData = this.getMenusforTable(tableId);
    const now = Date.now();

    // const userId = localStorage.getItem('currentUserId')
    //'663261866e6eab17243aa7f9';
    // const userId = this.currentUser.Id;
    let dbSchema = {
      currentDateAndTime: this.datepipe.transform(now, 'dd/MM/yyyy h:mm a'),
      menu: syncData.menus,
      tableId: syncData.table_id,
      discount: this.discountPercent,
      amount: this.discountPrice
    }
    this.backendService.storeOrders(dbSchema, this.currentUser.id).subscribe({
      next: (response) => {
        console.log("Order stored successfully!", response);
      },
      error: (error) => {
        console.error("Error storing order:", error);

      }
    });
    console.log("syncData", dbSchema)
  }


}

