import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-template-node-1',
  templateUrl: './template-node-1.component.html',
  styleUrls: ['./template-node-1.component.scss']
})
export class TemplateNode1Component implements AfterViewInit {

  @Input() propertiesInfo?: any;

  @Output() returnDataToWorkSpace = new EventEmitter<any>();
  @Output() clickOutside = new EventEmitter();

  formConfigNode = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private _elementRef: ElementRef
  ) {
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.propertiesInfo) {
      this.formConfigNode.patchValue({
        server_port: this.propertiesInfo?.server_port,
        server_name: this.propertiesInfo?.server_name
      });
    } else {
      this.formConfigNode.patchValue({
        server_port: '8080',
        server_name: 'server center'
      });
    }
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
