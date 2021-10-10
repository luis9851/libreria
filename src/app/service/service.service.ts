import { Injectable } from '@angular/core';
import {User} from './user'
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
//import { CookieService } from "ngx-cookie-service";
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {Libros} from '../service/libro'
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private key_desc = 'desc_';
  private  apiUrl:string='http://localhost:3000/api/'
  public admin: boolean = false;
  public user: String = "";

  constructor(private sanitizer: DomSanitizer,private http: HttpClient) { }

  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(error.error.message);
    }
    else {
      console.error(error);
    }
    return  throwError('Hubo un error en la aplicacion. Verifica logs');
  }

  auth(customer: User): Observable<any> {
    return this.http.post<User>('http://localhost:3000/api/check', customer)
      .pipe(
        catchError(this.handleError2<User>('Add Customer'))
      );
  }

  putPrestamo(reg: any):Observable<any> {
    let Reg = JSON.stringify(reg);
    let url=`${this.apiUrl}addPrestamo`
    //this.trustedDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    //console.log(this.trustedDashboardUrl);
    console.log('añadir');
    console.log(Reg);
    /* console.log(JSON.stringify(user)); */
    return this.http.post<any>(url,reg).pipe(
      catchError(this.handleError)
    );
  }

  private handleError2<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getLibros():Observable<any>{
    console.log('getLibros');
    const ident = localStorage.getItem('_identity');
    const token = localStorage.getItem('T_ac') != null ?localStorage.getItem('T_ac'):"";

    let httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json',
       "Authorization": String(token),"_identity" : String(ident) })
      
    }
    let url = `${this.apiUrl}home-guest`;
    return this.http.get<any>(url, httpOptions).pipe(
    catchError(this.handleError)
    );
  }

  verify():Observable<any>{
    const ident = localStorage.getItem('_identity');
    const token = localStorage.getItem('T_ac') != null ?localStorage.getItem('T_ac'):"";

    let httpOptions = {
      headers: new HttpHeaders({'Content-Type':'application/json',
       "Authorization": String(token),"_identity" : String(ident) })
      
    }
    let url = `${this.apiUrl}verify`;
    return this.http.get<any>(url, httpOptions).pipe(
    catchError(this.handleError)
    );
  }


  getLibro(idx:String):Observable<any>{
    let url=`${this.apiUrl}libro/${idx}`
    let authorization
    let ident
    
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.get<any>(url, httpOptions).pipe(
      tap(data=>{JSON.stringify(data)}),
      catchError(this.handleError)
    );

  }

  trustedDashboardUrl : SafeUrl | undefined;

  putAddUser(user: User):Observable<User> {
    let User = JSON.stringify(user);
    let url=`${this.apiUrl}add/${User}`
    this.trustedDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(this.trustedDashboardUrl);
    console.log('añadir');
    console.log(User);
    /* console.log(JSON.stringify(user)); */
    return this.http.put<any>(url,httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  perfil():Observable<any> {
    //var token = localStorage.getItem('T_ac')
    const ident = localStorage.getItem('_identity');
    const token = localStorage.getItem('T_ac') != null ?localStorage.getItem('T_ac'):"";

    //console.log(token)

      let httpOptions = {
        headers: new HttpHeaders({'Content-Type':'application/json',
         "Authorization": String(token),"_identity" : String(ident) })
        
      }
     return this.http.get<any>('http://localhost:3000/perfil', httpOptions).pipe(
      tap(data=>{JSON.stringify(data)}),
      catchError(this.handleError)
    );
    
  }
  
  updateUser(idx: string, Telefono: string): Observable<{}> {
    console.log("Actualizado");
    console.log(Telefono);
    let url = this.apiUrl + `update/${idx}/${Telefono}`;
    console.log(url);
    return this.http.post(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  correoUser(idx: string, email: string): Observable<{}> {
    console.log("Actualizado");
    console.log(email);
    let url = this.apiUrl + `update-email/${idx}/${email}`;
    console.log(url);
    return this.http.post(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  putBook(customer: any): Observable<any> {
    return this.http.post<User>('http://localhost:3000/api/create-book', customer)
      .pipe(
        catchError(this.handleError2<any>('Add Book'))
      );
  }

  

Search(search: string): Observable<any[]> {
  let url = `${this.apiUrl}products/${search}`;
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
        return this.http.get<any[]>(url,httpOptions).pipe(
          catchError(this.handleError)
        );
      
}
  postLibro(book: Libros):Observable<Libros>{
    console.log('editar');
    console.log(JSON.stringify(book));
    let edit = JSON.stringify(book);
    let url=`${this.apiUrl}editar/${edit}`
    console.log(book._id);
    return this.http.post<Libros>(url,httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  borrarLibro(_id: String):Observable<{}>{
    console.log("Servicio eliminar");
    let url = this.apiUrl + `libro/${_id}`;
    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getAdmin(){
    return this.admin;
  }

  setAdmin(admin: boolean){
    this.admin = admin;
  }

  getUser(){
    return this.user;
  }

  setUser(user: String){
    this.user = user;
    console.log("SetUser");
    console.log(user);
  }


  historial():Observable<any> {
    //var token = localStorage.getItem('T_ac')
    const ident = localStorage.getItem('_identity');
    const token = localStorage.getItem('T_ac') != null ?localStorage.getItem('T_ac'):"";

    //console.log(token)
      let httpOptions = {
        headers: new HttpHeaders({'Content-Type':'application/json',
         "Authorization": String(token),"_identity" : String(ident) })
        
      }
     return this.http.get<any>('http://localhost:3000/api/prestamos', httpOptions).pipe(
      tap(data=>{JSON.stringify(data)}),
      catchError(this.handleError)
    );
    
  }

  /* historialAdmin():Observable<any> {
    //var token = localStorage.getItem('T_ac')
    //const ident = localStorage.getItem('_identity');
    //const token = localStorage.getItem('T_ac') != null ?localStorage.getItem('T_ac'):"";

    //console.log(token)
      let httpOptions = {
        headers: new HttpHeaders({'Content-Type':'application/json'})
      }
     return this.http.get<any>('http://localhost:3000/api/historialAdmin', httpOptions).pipe(
      tap(data=>{JSON.stringify(data)}),
      catchError(this.handleError)
    );
    
  } */
  
  borrarPrestamo(_id: String):Observable<{}>{
    console.log("Servicio eliminar");
    let url = this.apiUrl + `eliminar/${_id}`;
    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
 


}

