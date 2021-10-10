import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule ,FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from '../service/user';
import { ServiceService } from '../service/service.service'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  /* createFormGrup(){
    return new FormGroup({
      Username: new FormControl('',Validators.required),
      Nombre: new FormControl('',[Validators.minLength(5), Validators.required]),
      email: new FormControl('',[Validators.email,Validators.required]),
      telefono: new FormControl(''),
    })
  } */

  EmailPattern = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  PassRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  NameRegex=/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  AddressRegex=/^[A-Za-z0-9'\.\-\s\,\#]+$/;
  PhoneRegex=/^[0-9]{10,10}$/;

  RegistroFormGrup = this.fb.group({
    FirstName: ['',[Validators.required,Validators.minLength(3),Validators.pattern(this.NameRegex)]],
    LastName: ['',[Validators.required,Validators.minLength(3),Validators.pattern(this.NameRegex)]],
    email: ['',[Validators.required,Validators.pattern(this.EmailPattern)]],
    password : ['',[Validators.required,Validators.minLength(8),Validators.maxLength(16),Validators.pattern(this.PassRegex)]],
    Address : ['',[Validators.required,Validators.minLength(8),Validators.pattern(this.AddressRegex)]],
    Telefono: ['',[Validators.required,Validators.minLength(10),Validators.pattern(this.PhoneRegex)]]
  });

  constructor(private _Service: ServiceService,private router: Router,private fb: FormBuilder) {}

  ngOnInit(): void {
  }

  /* onSubmit(){
    if(this.RegistroFormGrup.valid){
      console.warn(this.RegistroFormGrup.value);
      this.RegistroFormGrup.reset();
      console.log('Exitoso');
    }else if(!this.RegistroFormGrup.valid){
      console.log('Error');
    }
  } */

  get form(){return this.RegistroFormGrup.controls}
  get FirstName() {return this.RegistroFormGrup.get('FirstName');}
  get LastName() {return this.RegistroFormGrup.get('LastName');}
  get email() {return this.RegistroFormGrup.get('email');}
  get password() {return this.RegistroFormGrup.get('password');}
  get Address() {return this.RegistroFormGrup.get('Address');}
  get Telefono() {return this.RegistroFormGrup.get('Telefono');}

  regresar(){
    this.router.navigateByUrl("/");
  }


  AddUser(form: FormGroup){
    //console.log(JSON.stringify(this.RegistroFormGrup.value));
    console.log(JSON.stringify(form.value));
    if(this.RegistroFormGrup.valid){
      this._Service.putAddUser(form.value).subscribe(res => {
        console.log(res);
        alert('Guardado');
        this.router.navigateByUrl("/login");
      });
      this.RegistroFormGrup.reset();
    }else if(!this.RegistroFormGrup.valid){
      alert('Error');
      console.log('Error');
    }
  }

}
