import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {of} from "rxjs";

@Component({
  selector: 'app-template-node-2',
  templateUrl: './template-node-2.component.html',
  styleUrls: ['./template-node-2.component.scss']
})
export class TemplateNode2Component implements OnInit {

  @Input() propertiesInfo?: any;
  @Output() returnDataToWorkSpace = new EventEmitter<any>();

  dataService: string[] = [];
  formConfigNode = new FormGroup({});

  constructor(
    private fb: FormBuilder,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getListData();
    if (this.propertiesInfo) {
      this.formConfigNode.patchValue({
        services: this.propertiesInfo?.services,
        current_service: this.propertiesInfo?.current_service,
        isActive: this.propertiesInfo?.isActive,
      });
    } else {
      this.formConfigNode.patchValue({
        services: ['Product Service', 'Card Service', 'Employee Service'],
        current_service: 'Card Service',
        isActive: false,
      });
    }
  }

  initForm() {
    this.formConfigNode = this.fb.group({
      services: [''],
      current_service: [''],
      isActive: [true]
    })
  }

  saveConfigNode() {
    this.returnDataToWorkSpace.emit(this.formConfigNode.value);
  }

  getListData() {
    return of(['Product Service', 'Card Service', 'Employee Service', 'Domain Service'])
      .subscribe(
        (dataService) => {
          // @ts-ignore
          this.dataService = dataService;
        }
      )
  }

}
