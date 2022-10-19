import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { ProductService, DialogService, NotificationService } from './../../services';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Product } from '../product.interface';
import { Observable, from } from 'rxjs';
import { CustomValidators } from '../../customValidators';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements CanDeactivate<any>, OnInit {

  updateForm: FormGroup;
  name: FormControl;
  price: FormControl;
  description: FormControl;
  imageUrl: FormControl;
  discontinued: FormControl;
  fixedPrice: FormControl;
  product: Product;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService) { }

  onSubmit() {
    let updatedProduct = this.updateForm.value;
    this.submitted = true;
    this.productService
      .updateProduct(this.product.id, updatedProduct)
      .subscribe(
        product => {
          this.productService.clearCache();
          this.notificationService.notifyMessage('Product Updated.');
          this.router.navigateByUrl("/products");
        },
        error => this.notificationService.notifyError('Could not update product. ' + error)
      );
  }

  getProductFromRoute() {
    this.product = this.route.snapshot.data['product'];
  }

  ngOnInit() {
    this.getProductFromRoute();
    this.createForm();
    this.subscribeToFormChanges();
  }

  createForm() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.name = new FormControl(this.product.name, [Validators.required, Validators.maxLength(50), CustomValidators.productNameValidator]);
    this.price = new FormControl(this.product.price, [Validators.required, Validators.min(0), Validators.max(10000000)]);
    this.description = new FormControl(this.product.description, [Validators.minLength(3), Validators.maxLength(50)]);
    this.imageUrl = new FormControl(this.product.imageUrl, [Validators.pattern(validImgUrlRegex)]);
    this.discontinued = new FormControl(this.product.discontinued);
    this.fixedPrice = new FormControl(this.product.fixedPrice);

    this.updateForm = this.fb.group(
      {
        'name': this.name,
        'price': this.price,
        'description': this.description,
        'discontinued': this.discontinued,
        'fixedPrice': this.fixedPrice,
        'imageUrl': this.imageUrl
      }, { validator: CustomValidators.priceWithDescription }
    );
  }

  subscribeToFormChanges() {
    const upsertFormValueChanges$ = this.updateForm.valueChanges;
    upsertFormValueChanges$.subscribe(x => console.log({ event: 'VALUE CHANGED', object: x }));
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Permite navegacion sincrona [v] si el valor no se cambio o se ingresa.
    if (!this.updateForm.dirty || this.submitted) {
      return true;
    }
    //De lo contrario, preguntarle al usario con el servicio de cuadro de dialogo y retornar su
    //promesa que resuelve a v o f cuando el usuario toma su decision
    let p = this.dialogService.confirm('Descartar cambios?');
    let o = from(p);
    return o;
  }

}
