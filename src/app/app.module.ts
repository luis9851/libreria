import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginComponent} from './login/login.component';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import "@angular/compiler"
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatDividerModule} from '@angular/material/divider'
import {NavBarComponent} from './components/nav-bar/nav-bar.component'
import {LibroCardComponent} from './libro-card/libro-card.component'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import { InfoLibroComponent } from './info-libro/info-libro.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { RegistroComponent } from './registro/registro.component';
import { PrestamoComponent } from './prestamo/prestamo.component';

import { PerfilComponent } from './perfil/perfil.component';
import { ChatDialogComponent } from './chat/chat-dialog/chat-dialog.component';
import { UploadComponent } from './upload/upload.component';
import { AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule} from '@angular/fire/storage'
import {environment} from '../environments/environment';

import { ModificarComponent } from './modificar/modificar.component';
import { MessageComponent } from './message/message.component';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavBarComponent,
    LibroCardComponent,
    InfoLibroComponent,
    PerfilUsuarioComponent,
    RegistroComponent,
    PrestamoComponent,
    PerfilComponent,
    ChatDialogComponent,
    UploadComponent,
    ModificarComponent,
    MessageComponent,
    BienvenidaComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
