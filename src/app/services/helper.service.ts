import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private _snackBar: MatSnackBar) { }

  successMessage(message: string) {
    this._snackBar.open(message, 'close',{
      duration: 3000
    });
  }
  InfoMessage(message: string){
    this._snackBar.open(message, 'close',{
      duration: 3000
    });
  }
  ErrorMessage(message: string){
    this._snackBar.open(message, 'close',{
      duration: 3000
    });
  }
}
