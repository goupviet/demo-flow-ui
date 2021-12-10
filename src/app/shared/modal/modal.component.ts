import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NodeChart} from "../../app.model";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output() onClickContinuous = new EventEmitter();
  @Output() onClickCancel = new EventEmitter();

  @Input() nodesChart?: NodeChart[];

}
