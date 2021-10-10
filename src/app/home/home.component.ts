import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Libros } from '../service/libro';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  load: boolean=false;
  res: any =[];
  libros: any = [];
  verify: any = [];
  busc: any = [];
  admin: boolean = false;
  search: String = "";
  constructor(private _librosService: ServiceService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

        this.activatedRoute.queryParamMap
      .subscribe((params) => {
        this.load = true

          this.busc = params
            if (this.busc.params.search){
              this.Bsearch(this.busc.params.search);
            }else{
              this.getlibros();
            }
          
      }
    );
    
    
  }

  verLibro(_id:number){
    console.log(_id)
    this.router.navigate(['/info', _id]);
  }


  getlibros(){
    this._librosService.getLibros().subscribe(res =>{
      this.libros = res;
      this.load = false

    })
  }

  Bsearch(sea: string){
    this._librosService.Search(sea).subscribe(res =>{
      this.libros = res;
      this.load = false
    })

  }
}
