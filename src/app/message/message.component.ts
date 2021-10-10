import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() public title:string;
  @Input() public body:string;
  public ismodelShown: boolean = false;

  @Output('onConfirm') public confirmEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor() { 
    this.title = "Confirmar";
    this.body = "¿Estas seguro que deseas eliminarlo?";
  }

  ngOnInit(): void {
    this.ismodelShown = false;
  }

  confirmar(){
    this.confirmEmitter.emit(true);
    this.ismodelShown = false;
  }

  dismiss(){
    this.confirmEmitter.emit(false);
    this.ismodelShown = false;
  } 

}
