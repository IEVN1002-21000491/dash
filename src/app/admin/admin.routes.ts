import { Routes } from "@angular/router";
import { AuthGuard } from "../auth.guard";
export default [
    {
        path: '',
        loadComponent: () => import('./inicio/inicio.component'),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'gerente'] }  // Los roles 'admin' y 'gerente' pueden acceder
    },
    {
        path: 'dash',
        loadComponent: () => import('./admindashbord/admindashbord.component'),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'gerente'] }  // Los roles 'admin' y 'gerente' pueden acceder
    },
    {
        path: 'procesos',
        loadComponent: () => import('./procesos/procesos.component'),
        canActivate: [AuthGuard],
        data: { roles: ['admin', 'gerente','cliente'] }  // Los roles 'admin' y 'gerente' pueden acceder
    },
    {
        path: 'abc',
        loadComponent: () => import('./abc/abc.component'),
        canActivate: [AuthGuard],
        data: { roles: ['admin'] }  // Los roles 'admin' y 'gerente' pueden acceder
    }
] as Routes