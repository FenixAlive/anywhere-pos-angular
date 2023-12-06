import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteArticlesComponent } from './autocomplete-articles.component';

describe('AutocompleteArticlesComponent', () => {
  let component: AutocompleteArticlesComponent;
  let fixture: ComponentFixture<AutocompleteArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteArticlesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutocompleteArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
