import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(route);
  }
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkAuth(childRoute);
  }
  
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    if (requiredRoles && !this.checkRoles(requiredRoles)) {
      this.router.navigate(['/auth/access']);
      return false;
    }
    
    return true;
  }
  
  private checkAuth(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: route.url.join('/') } });
      return false;
    }
    
    if (requiredRoles && !this.checkRoles(requiredRoles)) {
      this.router.navigate(['/auth/access']);
      return false;
    }
    
    return true;
  }
  
  private checkRoles(requiredRoles: string[]): boolean {
    return requiredRoles.some(role => this.authService.hasRole(role));
  }
}