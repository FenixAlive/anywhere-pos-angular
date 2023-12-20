import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Article } from '../../models/supabase.model';

@Component({
  selector: 'app-registy',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
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

  constructor(
    private readonly formBuilder: FormBuilder
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
      tax_2_percentage: [0],
      tax_3_percentage: [0],
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
  calculateTotals(form: FormGroup) {
    const price = isNaN(parseFloat(form.value?.price)) ? 0 : parseFloat(form.value?.price)
    const quantity =  isNaN(parseFloat(form.value?.quantity)) ? 0 : parseFloat(form.value?.quantity)
    const subtotal = price * quantity ?? 0;
    form.controls?.['subtotal'].setValue( Math.round((subtotal + Number.EPSILON) * 100) / 100)
    const discountPercentage = parseFloat(form.value?.discount_percentage) ?? 0;
    const discountAmount = discountPercentage !== 0 ? subtotal * discountPercentage / 100 : parseFloat(form.value?.discount_amount) ?? 0;
    form.controls?.['discount_amount'].setValue( Math.round((discountAmount + Number.EPSILON) * 100) / 100)
    const tax1 = isNaN(parseFloat(form.value?.tax_1_percentage)) ? 0 : parseFloat(form.value?.tax_1_percentage)
    const tax2 = isNaN(parseFloat(form.value?.tax_2_percentage)) ? 0 : parseFloat(form.value?.tax_2_percentage)
    const tax3 = isNaN(parseFloat(form.value?.tax_3_percentage)) ? 0 : parseFloat(form.value?.tax_3_percentage)
    const total = (subtotal - discountAmount) * ((tax1 + tax2 + tax3) / 100 + 1) 
    form.controls?.['total'].setValue(Math.round((total + Number.EPSILON) * 100) / 100)
    this.values.emit(form)
  }

  deleteMyself(){
    this.deletedMyself.emit()
  }
}
