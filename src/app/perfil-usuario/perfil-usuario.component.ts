import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { bufferToggle } from 'rxjs/operators';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  private id: String = "";
  public show: boolean = false;
  public see: boolean = false;
  public ismodelShown: boolean = false;
  public Editar: any = 'Editar';
  users: any = [];
  prueba: any = [];
  libros: any = [];
  codigo: any;

  constructor(private router: Router,private activatedRoute: ActivatedRoute,
    public _Service: ServiceService) { }
  
  ngOnInit(): void {
    
      this._Service.perfil().subscribe(res =>{
        this.users= res;
        this.prueba= res;
        if(this.users!=null){
          this.history();
        }
      console.log(this.users)
    });
  }

history(){
  this._Service.historial().subscribe(res =>{
    this.libros= res;
  console.log(this.libros)
});
}

/* historyAdmin(){
  this._Service.historialAdmin().subscribe(res =>{
    this.libros= res;
  console.log(this.libros)
});
} */

delete(code: any){
  this._Service.borrarPrestamo(code).subscribe(res => {
    window.location.reload();
  }, (err) => {
    console.log(err);
  })
}

eliminar(code:any){
  console.log("eliminar libro");
  console.log(code);
  this.codigo = code;

}

cerrarModal(configuracion:boolean){
  this.ismodelShown = false;
  if(configuracion){
    console.log('Eliminar' + this.ismodelShown);
    this.delete(this.codigo);
  }else{
    console.log('No elimar' + this.ismodelShown);
  }
}

open() {
    this.show = !this.show;
  
    if (this.show)
      this.Editar = "Editar";
    else
      this.Editar = "Editar";
   }
  close() {
    this.show = !this.show;
  
    if (this.show)
      this.Editar = "Editar";
    else
      this.Editar = "Editar";
  }
  opened() {
   this.see = !this.see;
  
    if (this.show)
      this.Editar = "Editar";
    else
      this.Editar = "Editar";
  }
  closed() {
    this.see = !this.see;
  
  if (this.see)
      this.Editar = "Editar";
    else
      this.Editar = "Editar";
  }

  confirmar( Telefono: string) {
    console.log("editar");
    console.log(Telefono);
    //console.log(this.prueba._id);
    
    this._Service.updateUser(this.prueba._id,Telefono).subscribe(res => {
      window.location.reload();
    }, (err) => {
      console.log(err);
    })
  }

  correo( email: string) {
    console.log("editar");
    console.log(email);
    //console.log(this.prueba._id);
    this._Service.correoUser(this.prueba._id,email).subscribe(res => {
      this.router.navigateByUrl("/login");
    }, (err) => {
      console.log(err);
    })
  }

  

}