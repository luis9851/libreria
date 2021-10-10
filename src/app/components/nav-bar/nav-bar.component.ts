import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav'
import {BreakpointObserver} from '@angular/cdk/layout'
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ServiceService } from '../../service/service.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  
public color: String = 'accent';
public checked: boolean = false;
public search: boolean = false;
public state: boolean = false;
libros: any = [];
verify: any = [];
admin: boolean = false;
public find: String = "";
title: boolean = true;

@ViewChild(MatSidenav)
sidenav!: MatSidenav;
@ViewChild('tool') tool!: ElementRef;

  constructor(private _librosService: ServiceService,private observer: BreakpointObserver, private elementRef: ElementRef, private router: Router) { }

  ngOnInit(): void {

    this._librosService.verify().subscribe(res =>{
      this.verify = res;
      console.log(this.verify)
      if(this.verify.status == 504){

      }else if (this.verify.status == 200){

          if(this.verify.admin == true){
              this.admin = true;
              this._librosService.setAdmin(true);
              this._librosService.setUser((this.verify.user).toString());
          }else{
               this.admin = false;
               this._librosService.setAdmin(false);
               this._librosService.setUser((this.verify.user).toString());
          }
      }
    })
  }

  ngAfterViewInit(){
    

  this.observer.observe(['(max-width: 2000px) and (min-width: 1000px)']).subscribe((res) =>{
    if(res.matches){
      this.search = true;
      this.state = true
    }else{
      this.search = false; 
      this.state = false


    }
  })

  this.observer.observe(['(max-width: 2000px)']).subscribe((res) =>{
    if(res.matches){
      this.sidenav.mode = "over";
      this.sidenav.close()
    }else{
      this.sidenav.mode = "side";
      this.sidenav.open();
    }
  })
 
  }

  public useDefault = false;

    public toggle(event: MatSlideToggleChange) {
        console.log('toggle',this.elementRef );
        this.useDefault = event.checked;

        if(event.checked == false){
            this.title=false;
            this.elementRef.nativeElement.firstChild.style.background = 'white'
            //this.elementRef.nativeElement.children[0].children[0].children[0].a.style.background = 'white'

            this.elementRef.nativeElement.firstChild.style.color = 'black'
            this.elementRef.nativeElement.firstChild.style['border-bottom'] = '2px solid #000'
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'white';
            this.elementRef.nativeElement.childNodes[2].style.backgroundColor = "black"
            this.elementRef.nativeElement.childNodes[0].children[0].childNodes[0].style.backgroundColor = "black"
            this.elementRef.nativeElement.childNodes[0].children[0].childNodes[0].style.color = "white"
            //this.elementRef.nativeElement.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].style.color="black"

        }else{
            this.title=true;
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
            //this.elementRef.nativeElement.children[0].children[0].children[0].a.style.background = 'black'

            this.elementRef.nativeElement.firstChild.style.background = 'black'
            this.elementRef.nativeElement.firstChild.style.color = 'white'
            this.elementRef.nativeElement.firstChild.style['border-bottom'] = '2px solid #fff'
            this.elementRef.nativeElement.childNodes[2].style.backgroundColor = "black"
            this.elementRef.nativeElement.childNodes[0].children[0].childNodes[0].style.backgroundColor = "white"
            this.elementRef.nativeElement.childNodes[0].children[0].childNodes[0].style.color = "black"
            //this.elementRef.nativeElement.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].style.color="white"

        }
       

    }

    showBar(){
      
        if(this.search == false){
          this.search = true
        }else{
          this.search = false

        }
      }

      perfil(){
        this.router.navigateByUrl("/perfil")
    }

    onEnter(){
      this.router.navigate(['/home'], { queryParams: { search: this.find } });
    }

    close_sesion(){
      localStorage.removeItem('T_ac');
      localStorage.removeItem('_identity');
      this.router.navigateByUrl("/login");
    }
    
}

