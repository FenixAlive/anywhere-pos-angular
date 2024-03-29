import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupabaseService } from '../../services/supabase.service';
import { Article } from '../../models/supabase.model';
import { HelperService } from '../../services/helper.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatTable, MatTableModule} from '@angular/material/table';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatTableModule, CurrencyPipe,
    DecimalPipe],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit, AfterViewInit{
  loading = false
  articlesForm!: FormGroup
  @ViewChild('focusInput') focusInput!: ElementRef
  @ViewChild('addArticle') addArticleDialog!: any
  articleList!: Article[]
  displayedColumns: string[] = ['identifier_code', 'name', 'quantity', 'price_1', 'actions'];
  dataSource: Article[] = []
  dialogTitle = ''
  haveDialogSend = false
  @ViewChild(MatTable) table!: MatTable<Article>;

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder,
    private readonly helper: HelperService,
    private readonly dialog: MatDialog,
    public readonly language: LanguageService
  ) { this.createArticleForm() }

  ngOnInit(): void {
    this.supabase.articles.subscribe(data =>{
      this.articleList = data
      this.dataSource = this.articleList
      this.table?.renderRows();
    })
  }

  ngAfterViewInit() {
    this.setFocus()
  }
  
  setFocus(){
    setTimeout(()=>{
      this.focusInput?.nativeElement?.focus()
      this.articlesForm.markAsUntouched()
    })
  }

  createArticleForm() {
    this.articlesForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      identifier_code: [null, [Validators.required]],
      description: [null],
      price_1: [null, [Validators.required]],
      price_2: [0],
      price_3: [0],
      discount_amount: [0],
      discount_percentage: [0],
      tax_1_percentage: [null],
      tax_2_percentage: [null],
      tax_3_percentage: [null],
    })
  }

  async onSubmit(id?: number): Promise<void> {
    if(!this.articlesForm.valid) return
    this.articlesForm.controls['identifier_code'].setValue(this.articlesForm.controls['identifier_code'].value?.trim()?.toUpperCase())
    if(!id && this.checkIfExists()){
      this.helper.ErrorMessage(`Identifier Code: ${this.articlesForm.value?.identifier_code} already exists`)
      this.articlesForm.controls['identifier_code'].setValue(null)
      return
    }
    try {
      this.loading = true  
      const article = this.articlesForm.value as Article
      const review = ['price_2', 'price_3', 'discount_amount', 'discount_percentage']
      review.forEach((prop: string) => {
        if (!article?.[prop as keyof Article] && article?.[prop as keyof Article] !== 0) {
          delete article?.[prop as keyof Article]
        }
      })
      let res: PostgrestSingleResponse<null> = {} as PostgrestSingleResponse<null> 
      if(id){
        article.id = id
        res = await this.supabase.updateArticle(article)
      }else{
        res = await this.supabase.postArticle(article)
      }
      
      if (res?.error) throw res.error
      this.helper.successMessage('article sent correctly!')
      const resp = await this.supabase.getArticles()
      if(resp?.data)
      this.supabase.articles.next(resp.data)
    } catch (error) {
      if (error instanceof Error) {
        this.helper.ErrorMessage(error.message)
      }
    } finally {
      this.createArticleForm()
      this.loading = false
      this.setFocus()
    }
  }

  checkIfExists(){
    return this.articleList.findIndex(article => article.identifier_code?.trim()?.toUpperCase() === this.articlesForm.value?.identifier_code?.trim()?.toUpperCase()) !== -1
  }

  openNewArticle(){
    this.haveDialogSend = true
    this.dialogTitle = 'Add New Article'
    this.createArticleForm()
    const dialogRef = this.dialog.open(this.addArticleDialog,{
      width: 'auto',
      maxWidth: '100vw',
      minWidth: 'auto',
      maxHeight: '98vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.onSubmit()
      }
    });
  }

  viewArticle(article: Article){
    this.haveDialogSend = false
    this.dialogTitle = 'View Article'
    this.fillArticleForm(article)
    this.articlesForm.disable()
    const dialogRef = this.dialog.open(this.addArticleDialog,{
      width: 'auto',
      maxWidth: '100vw',
      minWidth: 'auto',
      maxHeight: '98vh'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editArticle(article: Article){
    this.haveDialogSend = true
    this.dialogTitle = 'Edit Article'
    this.fillArticleForm(article)
    this.articlesForm.enable()
    const dialogRef = this.dialog.open(this.addArticleDialog,{
      width: 'auto',
      maxWidth: '100vw',
      minWidth: 'auto',
      maxHeight: '98vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.onSubmit(article.id)
      }
    });
  }

  deleteArticle(article: Article){
    
  }

  fillArticleForm(article: Article){
    this.articlesForm.setValue({
      name: article.name,
      identifier_code: article.identifier_code,
      description: article.description,
      price_1: article.price_1,
      price_2: article.price_2,
      price_3: article.price_3,
      discount_amount: article.discount_amount,
      discount_percentage: article.discount_percentage,
      tax_1_percentage: article.tax_1_percentage,
      tax_2_percentage: article.tax_2_percentage,
      tax_3_percentage: article.tax_3_percentage,
    })
    console.log(this.articlesForm)
  }
}