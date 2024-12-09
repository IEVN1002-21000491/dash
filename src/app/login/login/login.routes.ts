import { Routes } from "@angular/router";

export default [
    {
        path: 'login',
        loadComponent: () => import('./login.component')
    }
] as Routes