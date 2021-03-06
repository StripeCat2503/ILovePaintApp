import { Component, OnInit } from '@angular/core';
import { ProviderModel } from 'src/app/models/provider.model';
import { Category } from 'src/app/models/category.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProviderService } from 'src/app/services/provider.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { MatDialogRef } from '@angular/material';
import { ValidationPatterns } from 'src/helpers/helper';
import { ImageService } from 'src/app/services/image.service';
import * as uuid from "uuid";
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit {

  public providerList: ProviderModel[];
  public categoryList: Category[];
  public success = false;
  public productImage: File;
  public imageUrl: string = "/assets/images/default_product.png";
  public uploadPath: string;
  public imageName: string;

  constructor(private fb: FormBuilder,
    private imageService: ImageService,
    private providerService: ProviderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<AddProductDialogComponent>) { }

    public loading = false;

  get nameControl(): FormControl {
    return this.addProductForm.controls.name as FormControl;
  }

  get quantityControl(): FormControl {
    return this.addProductForm.controls.quantity as FormControl;
  }

  get priceControl(): FormControl {
    return this.addProductForm.controls.price as FormControl;
  }

  get weightControl(): FormControl {
    return this.addProductForm.controls.weight as FormControl;
  }

  get providerControl(): FormControl {
    return this.addProductForm.controls.provider as FormControl;
  }

  get categoryControl(): FormControl {
    return this.addProductForm.controls.category as FormControl;
  }


  public addProductForm = this.fb.group({
    name: ['',
      [
        Validators.required,
        Validators.pattern(ValidationPatterns.noSpecialCharsWithVietnameseRegex),
        Validators.minLength(5),
        Validators.maxLength(30)
      ]],
    provider: [''],
    category: [''],
    image: [''],
    description: ['']
  })

  ngOnInit() {
    this.providerService.refreshProviderList();
    this.categoryService.refreshCategoryList();
  }

  addProduct() {
    this.loading = true;
    let formData = new FormData();
    formData.append('productName', this.addProductForm.get('name').value.trim());
    formData.append('description', this.addProductForm.get('description').value.trim());
    formData.append('providerID', this.addProductForm.get('provider').value);
    formData.append('categoryID', this.addProductForm.get('category').value);
    formData.append('image', this.productImage);

    this.productService.createProduct(formData)
      .subscribe(
        data => {
          this.productService.refreshProductList();
          this.loading = false;
          this.snackBarService.showSnackBar('Product added', 'CLOSE');
          this.dialogRef.close();
        },
        error => {
          this.loading = false;
          console.log(error);
          this.snackBarService.showSnackBar('Error!', 'CLOSE');
        }
      )
  }

  validProviderCategory() {
    return this.addProductForm.value.provider && this.addProductForm.value.category;
  }

  onImageSelected(event) {
    this.productImage = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.readAsDataURL(this.productImage);

    fileReader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }

  }

}
