import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

/**
 * checks if the user is logged in
 * @param route
 * @param state
 * @returns true if the user is logged in, false otherwise
 */
export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const userId = loginService.getUserId();

  if (userId) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
