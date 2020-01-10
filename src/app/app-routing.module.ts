import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'explore', pathMatch: 'full' },
  { path: 'explore', loadChildren: () => import('./Pages/xplore/xplore.module').then( m => m.XplorePageModule)},

  {
    path: 'xplore',
    loadChildren: () => import('./Pages/xplore/xplore.module').then( m => m.XplorePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    canActivate:[AuthGuardService],
    path: 'booking-modal',
    loadChildren: () => import('./booking-modal/booking-modal.module').then( m => m.BookingModalPageModule)
  },
  {
    path: 'success-page',
    loadChildren: () => import('./pages/success-page/success-page.module').then( m => m.SuccessPagePageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    canActivate:[AuthGuardService],
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
 path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },  {
    path: 'customize',
    loadChildren: () => import('./customize/customize.module').then( m => m.CustomizePageModule)
  },

 


];
   

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
