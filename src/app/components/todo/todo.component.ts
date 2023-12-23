import { KeyValuePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AutocompleteArticlesComponent } from '../autocomplete-articles/autocomplete-articles.component';
import { RegistyComponent } from '../registy/registy.component';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SupabaseService } from '../../services/supabase.service';
import { Todo } from '../../models/supabase.model';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, AutocompleteArticlesComponent, RegistyComponent, MatDatepickerModule, 
    MatNativeDateModule, KeyValuePipe, MatTableModule, MatSlideToggleModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
 todoInput = ''
 displayedColumns: string[] = ['todo', 'actions'];
  dataSource: Todo[] = []
  @ViewChild(MatTable) table!: MatTable<Todo>;

  constructor(private supabase: SupabaseService, private helper: HelperService){
    this.getTodos()

  }

  async getTodos(){
    const data = await this.supabase.getTodos()
    if(data.error){
      this.helper.ErrorMessage(data.error?.message)
    }else{
      this.dataSource = data.data as Todo[]
      this.table.renderRows();
    }
  }

 async add(){
  if(this.todoInput.trim()?.length === 0){
    return
  }
  try{
    const todo: Todo = {
      todo: this.todoInput,
      done: false
    }
    const res = await this.supabase.postTodo(todo)
      if (res?.error) throw res.error
      this.helper.successMessage('Todo sent correctly!')
      this.getTodos()
      this.todoInput = ''
  } catch (error) {
    if (error instanceof Error) {
      this.helper.ErrorMessage(error.message)
    }
  }
}

async updateTodo(todo: Todo){
  try{    
    const res = await this.supabase.updateTodo(todo)
      if (res?.error) throw res.error
      this.helper.successMessage('Todo updated correctly!')
  } catch (error) {
    if (error instanceof Error) {
      this.helper.ErrorMessage(error.message)
    }
  }
}

async deleteTodo(todo: Todo){
  this.dataSource = this.dataSource.filter(obj =>obj.id !== todo.id)
  this.table.renderRows();
  if(!todo.id) return
  const res = await this.supabase.deleteTodo(todo.id)
  if (res?.error) throw res.error
  this.helper.successMessage('Todo removed correctly!')
 }

}
