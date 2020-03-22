import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderItemCart } from '../models/order-item-cart';
import { DataConfig } from 'src/config/data';
import { Router } from '@angular/router';
import { Order } from '../models/order.model';
import { formatNumber } from 'src/helpers/helper';
import { OrderItem } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient,
    private router: Router) { }

  public orderItemList: OrderItem[];
  public total: any = 0;

  public orderList: Order[] = [];

  refreshOrderItemList() {
    this.orderItemList = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      let key = sessionStorage.key(i);
      this.orderItemList.push(JSON.parse(sessionStorage.getItem(key)));
    }

    this.total = 0;

    for (let i = 0; i < this.orderItemList.length; i++) {
      this.total = this.total + this.orderItemList[i].amount;
      this.orderItemList[i].product.productVolumes[0].price = formatNumber(this.orderItemList[i].product.productVolumes[0].price);
    }
    this.total = formatNumber(this.total);
  }

  addOrderItemToCart(orderItem: OrderItem) {
    sessionStorage.setItem('order-item-' + orderItem.productId + '-' + orderItem.product.productVolumes[0].volumeValue,
      JSON.stringify(orderItem));
    this.refreshOrderItemList();
  }

  checkoutOrder(orderData: any) {
    return this.http.post(DataConfig.baseUrl + '/order', orderData); 
  }

  loadOrderList() {
    this.http.get(DataConfig.baseUrl + '/order')
      .subscribe(
        data => this.orderList = data as Order[],
        error => console.log(error)
      )
  }

  getOrderList() {
    return this.http.get(DataConfig.baseUrl + '/order');
  }

  getOrderById(id) {
    return this.http.get(DataConfig.baseUrl + '/order/' + id);
  }

  getOrder(id) {
    this.http.get(DataConfig.baseUrl + '/order/' + id)
      .subscribe(
        data => { return data as Order },
        error => console.log(error)
      )
  }

  updateOrder(order) {
    return this.http.put(DataConfig.baseUrl + '/order', order);
  }

  removeOrder(id) {
    this.http.delete(DataConfig.baseUrl + '/order/' + id)
      .subscribe(
        res => {
          this.loadOrderList();
        },
        err => console.log(err)
      )
  }
}
