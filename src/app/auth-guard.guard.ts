import { CanActivateFn } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { inject } from '@angular/core';


export const authGuardGuard: CanActivateFn = (route, state) => {
  return !!inject(SupabaseService).session;
};
