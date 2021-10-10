import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule ,FormGroup, FormBuilder, FormControl, FormArray,Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from '../service/user';
import { ServiceService } from '../service/service.service'


@Component({
  selector: 'app-prestamo',
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.css']
})
export class PrestamoComponent implements OnInit {
  id: String = "";
  libro: any = [];
  fecha: any;
  public ismodelShown: boolean = false;

  RegistroFormGrup = this.fb.group({
    Titulo: ['',[Validators.required]],
    email: ['',[Validators.required]],
    Editorial: ['',[Validators.required]],
    Fecha_inicio: ['',[Validators.required]],
    Fecha_fin : ['',[Validators.required]],
    Precio : ['',[Validators.required]],
    Clave: ['',[Validators.required]],
    RutaDeImagen: ['',[Validators.required]]

  });

  constructor(private router: Router,private activatedRoute: ActivatedRoute,private _LibrosService: ServiceService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.id = params['id'];
      console.log(this.id)
      this._LibrosService.getLibro(this.id).subscribe(book => {
        this.libro = book;
        console.log(this.libro);
      },
      error => {

      });
      
    });

    console.log("Prestamo"+this._LibrosService.getUser());
  }

  get form(){return this.RegistroFormGrup.controls}


  fechaInicio(start: any){
    console.log(start);
    this.RegistroFormGrup.patchValue({Fecha_inicio: start})
  }
  fechaFin(End: any){
    console.log(End);
    this.RegistroFormGrup.patchValue({Fecha_fin: End})

  }
  
  AddPrestamo(){
    this.RegistroFormGrup.patchValue({Titulo: this.libro.Titulo})
    this.RegistroFormGrup.patchValue({Clave: this.libro.Clave})
    this.RegistroFormGrup.patchValue({Editorial: this.libro.Editorial})
    this.RegistroFormGrup.patchValue({Precio: this.libro.Precio})
    this.RegistroFormGrup.patchValue({RutaDeImagen: this.libro.RutaDeImagen})
    this.RegistroFormGrup.patchValue({email: this._LibrosService.getUser()})

    //console.log(JSON.stringify(this.RegistroFormGrup.value));
    console.log(JSON.stringify(this.RegistroFormGrup.value));
     if(this.RegistroFormGrup.valid){
      this._LibrosService.putPrestamo(this.RegistroFormGrup.value).subscribe(res => {
        console.log(res);
        alert('Guardado');
        this.router.navigateByUrl('/home');
      });
      this.RegistroFormGrup.reset();
    }else if(!this.RegistroFormGrup.valid){
      alert('Error');
      console.log('Error');
    } 
  }

  RegresarALibro(){
    this.router.navigate(['/info',this.id]);
  }
}
