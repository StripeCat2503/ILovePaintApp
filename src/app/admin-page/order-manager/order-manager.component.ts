import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { OrderDetailsDialogComponent } from './order-details-dialog/order-details-dialog.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Order } from 'src/app/models/order.model';
import { DialogService } from 'src/app/services/dialog.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {

  constructor(private orderService: OrderService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public dialog: MatDialog) { }

  public filterForm: FormGroup;

  ngOnInit() {
    this.filterForm = this.fb.group({
      status: ['-1']
    });
    

    if (!this.orderService.orderList || this.orderService.orderList.length === 0) {
      this.orderService.loadOrderList();
    }
  }

  openOrderDetailsDialog(order: Order) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '50%';
    dialogConfig.height = '600px';
    dialogConfig.data = order;
    this.dialog.open(OrderDetailsDialogComponent, dialogConfig);
  }

  onStatusSelected(event) {
    if (event.target.checked) {
      this.filterOrders(event.target.value);
    }
    
  }

  filterOrders(status) {

    if (status == -1) {
      this.orderService.loadOrderList();
    }
    else {
      this.orderService.getOrderList()
        .subscribe(
          data => {
            this.orderService.orderList = data as Order[];
            this.orderService.orderList = this.orderService.orderList
              .filter(o => o.status == status);
          }
        )

    }
  }

  onOrderDelete(id){
    this.dialogService.openConfirmDialog('Are you sure to delete this order?')
    .afterClosed()
    .subscribe(res =>{
      if(res){
        this.orderService.removeOrder(id)
        .subscribe(
          res =>{
            this.orderService.loadOrderList();
            this.snackBarService.showSnackBar('Order removed', 'CLOSE');     
          },
          err =>{
            console.log(err);
            this.snackBarService.showSnackBar('Error!', 'CLOSE');
          }
        )    
      }
     
    })
  }

}
