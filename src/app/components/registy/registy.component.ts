import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Article } from '../../models/supabase.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-registy',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './registy.component.html',
  styleUrl: './registy.component.scss'
})
export class RegistyComponent implements OnChanges {
  loading = false
  registryForm!: FormGroup
  @Input() article!: Article
  @Input() whichPrice: 'price_1' | 'price_2' | 'price_3' | 'cost' = 'price_1'
  @Input() canDeleteMyself: boolean | undefined = undefined
  @Output() values = new EventEmitter<FormGroup>()
  @Output() deletedMyself = new EventEmitter<void>()
  @ViewChild('qtyInput') qtyInput!: ElementRef
  @ViewChild('moreDialog') moreDialog!: any

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { this.createRegistryForm() }

  ngOnChanges() {
    if (this.article) {
      setTimeout(()=>{
        this.fillArticleInfo(this.article, this.registryForm)
        this.calculateTotals(this.registryForm)
        this.qtyInput?.nativeElement?.focus()
      },0)
    }
  }

  createRegistryForm() {
    this.registryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      quantity: [1, [Validators.required]],
      price: [0, [Validators.required]],
      subtotal: [0],
      discount_amount: [0],
      discount_percentage: [0],
      tax_1_percentage: [0],
      tax_1_amount: [0],
      tax_2_percentage: [0],
      tax_2_amount: [0],
      tax_3_percentage: [0],
      tax_3_amount: [0],
      total: [0],
      description: [''],
    })
    this.registryForm.controls['name'].disable()
    this.registryForm.controls['subtotal'].disable()
    this.registryForm.controls['total'].disable()
  }

  fillArticleInfo(article: Article, form: FormGroup) {
    form.controls?.['name']?.setValue(article.name)
    if(this.whichPrice !== 'cost')
    form.controls?.['price']?.setValue(article[(this.whichPrice ?? 'price_1') as keyof Article] ?? 0)
    form.controls?.['discount_amount']?.setValue(article.discount_amount ?? 0)
    form.controls?.['discount_percentage']?.setValue(article.discount_percentage ?? 0)
    form.controls?.['tax_1_percentage']?.setValue(article.tax_1_percentage ?? 0)
    form.controls?.['tax_2_percentage']?.setValue(article.tax_2_percentage ?? 0)
    form.controls?.['tax_3_percentage']?.setValue(article.tax_3_percentage ?? 0)
  }

  /**
   * calculate and mutate form total
   * @param form formGroup that calculate and mutate the total
   */
  //TODO: si el descuento y tax percentaje es nulo entonces dejar que ponga el monto, si el usuario pone cero entonces no, ver si poner un check o algo para elegir uno u otro
  calculateTotals(form: FormGroup) {
    const price = this.formatMoney(form.value?.price)
    const quantity =  this.formatMoney(form.value?.quantity) //isNaN(parseFloat(form.value?.quantity)) ? 0 : parseFloat(form.value?.quantity)
    const subtotal = Math.round(((price * quantity ?? 0)+Number.EPSILON)*100)/100;
    form.controls?.['subtotal'].setValue(subtotal)
    const discountPercentage = this.formatMoney(form.value?.discount_percentage)//parseFloat(form.value?.discount_percentage) ?? 0;
    const discountAmount =  this.checkIsPercentage(subtotal, discountPercentage, form.value?.discount_amount)//discountPercentage !== 0 ? subtotal * discountPercentage / 100 : this.formatMoney(form.value?.discount_amount)  //parseFloat(form.value?.discount_amount) ?? 0;
    form.controls?.['discount_amount'].setValue(discountAmount)
    const tax1 = this.formatMoney(form.value?.tax_1_percentage)//isNaN(parseFloat(form.value?.tax_1_percentage)) ? 0 : parseFloat(form.value?.tax_1_percentage)
    const tax1Amount =  this.checkIsPercentage(subtotal-discountAmount, tax1, form.value?.tax_1_amount)
    form.controls?.['tax_1_amount']?.setValue(tax1Amount)
    const tax2 = this.formatMoney(form.value?.tax_2_percentage)//isNaN(parseFloat(form.value?.tax_2_percentage)) ? 0 : parseFloat(form.value?.tax_2_percentage)
    const tax2Amount =  this.checkIsPercentage(subtotal-discountAmount, tax2, form.value?.tax_2_amount)
    form.controls?.['tax_2_amount']?.setValue(tax2Amount)
    const tax3 = this.formatMoney(form.value?.tax_3_percentage)//isNaN(parseFloat(form.value?.tax_3_percentage)) ? 0 : parseFloat(form.value?.tax_3_percentage)
    const tax3Amount =  this.checkIsPercentage(subtotal-discountAmount, tax3, form.value?.tax_3_amount)
    form.controls?.['tax_3_amount']?.setValue(tax3Amount)
    const total = (subtotal - discountAmount) -(tax1Amount+tax2Amount+tax3Amount) 
    form.controls?.['total'].setValue(Math.round((total + Number.EPSILON) * 100) / 100)
    this.values.emit(form)
  }

  formatMoney(data: string){
    return isNaN(parseFloat(data)) ? 0 : Math.round((parseFloat(data) + Number.EPSILON) * 100) / 100
  }

  checkIsPercentage(subtotal: number, percentage: number, amount: string){
    return percentage !== 0 ? subtotal * percentage / 100 : this.formatMoney(amount)
  }

  deleteMyself(){
    this.deletedMyself.emit()
  }
  
  openMore(){
    const dialogRef = this.dialog.open(this.moreDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
