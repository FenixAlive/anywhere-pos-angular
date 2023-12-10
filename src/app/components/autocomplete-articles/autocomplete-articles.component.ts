import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SupabaseService } from '../../services/supabase.service';
import { Article } from '../../models/supabase.model';
@Component({
  selector: 'app-autocomplete-articles',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './autocomplete-articles.component.html',
  styleUrl: './autocomplete-articles.component.scss'
})
export class AutocompleteArticlesComponent implements OnInit, AfterViewInit {
  @Input() keepOnSelect = false
  @Output() selected = new EventEmitter()
  myControl = new FormControl('');
  options: Article[] = [];
  filteredOptions!: Observable<Article[]>;
  @ViewChild('articleInput') articleInput!: ElementRef
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  constructor(private readonly supabase: SupabaseService) {
    this.supabase.articles.subscribe(articles => this.options = articles)
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        this.articleInput.nativeElement.focus()
        this.autocompleteTrigger.closePanel()
      }, 50
    )
  }

  private _filter(value: string): Article[] {
    if (typeof value !== 'string') return this.options
    const filterValue = value?.toLowerCase();

    return this.options.filter(option => {
      return option?.name?.toLowerCase()?.includes(filterValue)
    });
  }

  async getArticles(term = '') {
    const resp = await this.supabase.getArticles(term)
    if (resp?.data) {
      this.options = resp.data
    }
  }

  displayFn(article: Article): string {
    if (this.keepOnSelect) {
      return (article?.identifier_code ?? '') + ' - ' + (article?.name ?? '');
    }
    return ''
  }
}