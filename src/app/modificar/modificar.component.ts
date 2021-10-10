import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service/service.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnInit {

  private id: String = "";
  libro: any = [];
  accion: string = "2";
  public ismodelShown: boolean = false;

  constructor(private router: Router,private activatedRoute: ActivatedRoute,private _LibrosService: ServiceService) { 
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

  ngOnInit(): void {
  }

  editLibro(){
    this.router.navigate(['/editar', { accion: this.accion, id: this.id}]);
  }

  Cancelar(){
    this.router.navigate(['/libros']);
  }

  EditBook(form: NgForm){
    console.log(form);
    this._LibrosService.postLibro(form.value).subscribe(res => {
      console.log(res);
      alert('Guardado');
      this.router.navigate(['/info',this.id]);
    });
  }

  Regreasar(){
    this.router.navigate(['/info',this.id]);
  }

}
