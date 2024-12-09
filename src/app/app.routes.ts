import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    children: [
      {
        path: '',
        loadChildren: () => import('./login/login/login.routes')
      }
    ]
  },
  {
    path: 'dash',
    loadChildren: () => import('./admin/admin.routes'),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login/login'
  }
];
