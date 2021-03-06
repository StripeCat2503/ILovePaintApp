import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product.model';
import { OrderItemCart } from 'src/app/models/order-item-cart';
import { OrderService } from 'src/app/services/order.service';
import { DataConfig } from 'src/config/data';
import { ProductVolumeService } from 'src/app/services/product-volume.service';
import { ProductVolume } from 'src/app/models/product-volume.model';
import { formatNumber } from 'src/helpers/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderItem } from 'src/app/models/order-item.model';
import { CommentService } from 'src/app/services/comment.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ColorCatalogComponent } from '../color-catalog/color-catalog.component';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {

  constructor(private productService: ProductService,
    private orderService: OrderService,
    private commentService: CommentService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }
  public product: Product;
  public productImage: string;
  public quantity: number = 1;
  public formatedPrice: number;

  public currentProductVolume: ProductVolume;

  public comments;
  
  public colorId;
  public colorCode;
  public colorName;
  public colorErr: string;

  ngOnInit() {

    let productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(productId)
      .subscribe(data => {
        this.product = data as Product;
        this.currentProductVolume = this.product.productVolumes[0];
        this.formatedPrice = formatNumber(this.currentProductVolume.price);   
        
      });

      this.commentService.loadComments(productId);
  }

  addToCart() {
    
    if(!this.colorId){
      this.colorErr = 'You forget to choose color';
      return;
    }
    else{
      this.colorErr = '';
    }

    let orderItem: OrderItem = {
      productId: this.product.id,
      quantity: this.quantity,
      product: this.product,
      amount: this.quantity * this.currentProductVolume.price,
      colorCode: this.colorCode,
      colorName: this.colorName
    }

    orderItem.product.productVolumes = orderItem.product.productVolumes
    .filter(pv => pv.id == this.currentProductVolume.id);
    orderItem.amount = orderItem.quantity * orderItem.product.productVolumes[0].price;

    this.orderService.addOrderItemToCart(orderItem);

    this.router.navigate(['/']);
  }

  increaseQuantity(){
    this.quantity = this.quantity + 1;
  }

  decreaseQuantity(){
    if(this.quantity === 1){
      return;
    }

    this.quantity = this.quantity - 1;
  }

  onVolumeChange(e){
    
    this.currentProductVolume = this.product.productVolumes
    .filter(p => p.id == e.target.value)[0];
    
    this.formatedPrice = formatNumber(this.currentProductVolume.price);
  
  }

  seeMore(e){
    e.preventDefault();

    this.commentService.chunkSize = this.commentService.chunkSize + 5;
    let productId = this.route.snapshot.paramMap.get('id');
    this.commentService.loadComments(productId);
  }

  openColorCatalog(){
    let dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.data = this.product.id;
    let dialogRef = this.dialog.open(ColorCatalogComponent, dialogConfig);

    dialogRef.afterClosed()
    .subscribe(
      res =>{
        if(res){
          this.colorId = res.id;
          this.colorCode = res.colorCode;
          this.colorName = res.name;
        }
        
      }
    )
  }

}
