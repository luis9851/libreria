import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './home.component'
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import {NavBarModule} from '../components/nav-bar/nav-bar.module'
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NgModule,
    NavBarModule
    
  ],
})
export class HomeModule { }
