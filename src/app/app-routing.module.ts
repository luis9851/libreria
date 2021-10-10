import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {InfoLibroComponent} from './info-libro/info-libro.component'
import {PerfilUsuarioComponent} from './perfil-usuario/perfil-usuario.component'
import {RegistroComponent} from './registro/registro.component';
import { PrestamoComponent } from './prestamo/prestamo.component';
import {UploadComponent} from './upload/upload.component'
import { ModificarComponent } from './modificar/modificar.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component'; 

const routes: Routes = [
  {
  
    path: 'login',
    component: LoginComponent
  },
  {
  
    path: 'home',
    component: HomeComponent
  },
  {
  
    path: 'info/:id',
    component: InfoLibroComponent
  },
  {
    path: 'editar/:id',
    component: ModificarComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
  path: 'upload',
  component: UploadComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  
    path: 'perfil',
    component: PerfilUsuarioComponent
  },
  {
  
    path: 'prestamo/:id',
    component: PrestamoComponent
  },
  {
  
    path: 'Bienvenida',
    component: BienvenidaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
