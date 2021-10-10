import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-info-libro',
  templateUrl: './info-libro.component.html',
  styleUrls: ['./info-libro.component.css']
})
export class InfoLibroComponent implements OnInit {

  id: String = "";
  libro: any = [];
  public ismodelShown: boolean = false;
  constructor(private router: Router,private activatedRoute: ActivatedRoute,public _LibrosService: ServiceService) { }

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
  }
  home(){
      this.router.navigateByUrl("/home")
  }

  confirmar(){
    this.ismodelShown = false;
  }

  eliminarLibro(){
    console.log("eliminar libro");
    this._LibrosService.borrarLibro(this.id).subscribe(res => {
      this.router.navigate(['/home']);
    }, (err) => {
      console.log(err);
    })
  }

  cerrarModal(configuracion:boolean){
    this.ismodelShown = false;
    if(configuracion){
      console.log('Eliminar' + this.ismodelShown);
      this.eliminarLibro();
    }else{
      console.log('No elimar' + this.ismodelShown);
    }
  }
  Edit(){
    this.router.navigate(['/editar',this.id]);
  }
 Prestamo(){
    this.router.navigate(['/prestamo',this.id]);
  }
}

