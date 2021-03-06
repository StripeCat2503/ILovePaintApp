import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { DataConfig } from 'src/config/data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = 'https://localhost:44385/api/products';
  public productList: Product[] = [];

  public currentChunkIndex = 0;
  public chunkSize = 5;
  public pageItems = [];
  public stopNext = false;
  public stopPrev = true;

  constructor(private http: HttpClient) { }

  getProductList() {
    return this.http.get(this.url);
  }

  refreshProductList() {
    this.http.get(this.url)
      .subscribe(data => {
        this.productList = data as Product[];    
        this.updateState();
      });
  }

  updateState() {
    let maxChunks = Math.ceil(this.productList.length / this.chunkSize);
    if (this.pageItems.length > 0) {
      this.pageItems = [];
    }
    for (let i = 0; i < maxChunks; i++) {
      this.pageItems.push(i + 1);
    }
    if (maxChunks === 1) {
      this.stopNext = true;
      this.stopPrev = true;
    }

    if (this.currentChunkIndex > 0) {
      this.currentChunkIndex = this.currentChunkIndex - 1;
    }

    if (this.currentChunkIndex <= 0) {
      this.stopPrev = true;
      this.stopNext = false;
    }

    if (this.currentChunkIndex >= this.pageItems.length - 1) {
      this.stopNext = false;
      this.stopNext = true;
    }
  }

  getProductById(id) {
    return this.http.get(this.url + '/' + id);
  }

  getProductChunks() {
    if (!this.productList) {
      return [];
    }

    return this.productList
      .slice(this.currentChunkIndex * this.chunkSize,
        (this.currentChunkIndex * this.chunkSize) + this.chunkSize);
  }

  createProduct(formData: FormData) {
    return this.http.post(DataConfig.baseUrl + '/products/', formData);
  }

  deleteProduct(id) {
    this.http.delete(DataConfig.baseUrl + '/products/' + id)
      .subscribe(
        data => {
          this.refreshProductList();
        },
        error => console.log(error)
      );
  }

  updateProduct(productId, formData: FormData) {
    return this.http.put(DataConfig.baseUrl + '/products/' + productId, formData);    
  }

  getProductVolume(productId, volumeId){
    return this.http.get(DataConfig.baseUrl + '/products/' + productId + '/volumes/' + volumeId);
  }

}
