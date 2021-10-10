import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-libro-card',
  templateUrl: './libro-card.component.html',
  styleUrls: ['./libro-card.component.css']
})
export class LibroCardComponent implements OnInit {

  @Input() libro: any = {};
  @Input() index: number = 0;
  
  @Output() libroSeleccionado: EventEmitter<number>;

  constructor(private router: Router) {
    this.libroSeleccionado = new EventEmitter();
   }

  ngOnInit(): void {
  }

  verLibro(){
    this.router.navigate(['/info',this.libro._id]);
  }


  limitador (str: string){

    const fin = str.substring(0, 45);
    return fin
  }

}
