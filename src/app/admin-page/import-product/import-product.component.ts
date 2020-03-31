import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { ProductVolume } from 'src/app/models/product-volume.model';
import { ColorService } from 'src/app/services/color.service';
import { Color } from 'src/app/models/color.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddVolumeDialogComponent } from './add-volume-dialog/add-volume-dialog.component';

@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.css']
})
export class ImportProductComponent implements OnInit {

  constructor(private productService: ProductService,
    private colorService: ColorService,
    private dialog: MatDialog) { }

  public product: Product;
  public productVolume: ProductVolume;
  

  ngOnInit() {
    this.productService.refreshProductList();
  }

  onSelectProduct(e){
    let productId = e.target.value;
    if(productId){
      this.productService.getProductById(productId)
      .subscribe(
        res => {
          this.product = res as Product;
          console.log(this.product)        
        },
        err =>{
          console.log(err);
         
        }
      )
    }
    else{
      this.product = null;     
    }

    this.productVolume = null;
  }

  onVolumeChange(e){
    let volumeId = e.target.value;
    if(volumeId){
      let index = this.product.productVolumes.findIndex(pv => pv.id == volumeId);
      if(index >= 0){
        this.productVolume = this.product.productVolumes[index];
      }
      else{
        this.productVolume = null;
      }
    }
    else{
      this.productVolume = null;
    }
  }

  openAddVolumeDialog() {
    let dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50%';
    dialogConfig.data = this.product.id;

    this.dialog.open(AddVolumeDialogComponent, dialogConfig);

  }
}