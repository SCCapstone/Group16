import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';

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
