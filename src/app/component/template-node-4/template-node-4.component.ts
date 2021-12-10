import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-template-node-4',
  templateUrl: './template-node-4.component.html',
  styleUrls: ['./template-node-4.component.scss']
})
export class TemplateNode4Component implements OnInit {

  @Input() propertiesInfo?: any;

  @Output() returnDataToWorkSpace = new EventEmitter<any>();

  formConfigNode = new FormGroup({});

  constructor(
    private fb: FormBuilder,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.formConfigNode.patchValue({
      server_port: this.propertiesInfo?.server_port,
      server_name: this.propertiesInfo?.server_name
    });
  }

  initForm() {
    this.formConfigNode = this.fb.group({
      server_port: [''],
      server_name: ['']
    })
  }

  saveConfigNode() {
    this.returnDataToWorkSpace.emit(this.formConfigNode.value);
  }

}
