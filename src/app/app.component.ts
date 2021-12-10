import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {
  NODE_INIT,
  NODE_TYPE,
  NodeChart,
  NodeChartModel,
  PropertyTemporary,
  TemplateOriginNodeType,
  URL
} from "./app.model";
import {FormBuilder, FormGroup} from "@angular/forms";

declare const drag: any;
declare const allowDrop: any;
declare const drop: any;
declare const editor: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild('formConfigNodeTemplate', {static: true}) formConfigNodeTemplate: ElementRef;

  TEMPLATE_ORIGIN_NODE_TYPE = TemplateOriginNodeType;
  loadAPI: Promise<any> | undefined;
  nodes: NodeChartModel[] = NODE_INIT;
  nodeFlowChartInfo: NodeChart[] = [];
  propertiesOfNodesCreated: PropertyTemporary[] = [];
  formConfigNode: FormGroup = new FormGroup({});
  idNodeSelected = '';
  typeNodeSelected = '';
  propertiesNodeSelected?: any;
  showConfigNode = false;
  showModal = false;
  nodeIsMoving = false;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngAfterViewInit(): void {
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
    });

    this.handleEventNodeSelected();

    this.handleEventNodeCreated();

    this.handleEventNodeRemove();

    this.handleEventNodeMoved();
  }

  public loadScript() {
    let node = document.createElement('script');
    node.src = URL;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  drag($event: DragEvent) {
    this.showConfigNode = false;
    drag($event);
  }

  allowDrop($event: DragEvent) {
    allowDrop($event);
  }

  drop($event: DragEvent) {
    drop($event);
  }

  handleEventNodeSelected() {
    document.addEventListener('nodeSelected', $event => {
      if (this.formConfigNode.value) {
        this.formConfigNode = this.fb.group({});
      }
      // @ts-ignore
      this.idNodeSelected = $event.target.id;
      // @ts-ignore
      this.typeNodeSelected = $event.target.attributes['node_type'].value;
      this.showConfigNode = true;
      // @ts-ignore
      this.formConfigNodeTemplate.nativeElement.style.top = $event.target.offsetTop + 'px';
      // @ts-ignore
      this.formConfigNodeTemplate.nativeElement.style.left = $event.target.offsetLeft + 'px';

      this.updatePropertiesNodeSelected();
      this.handleEventDragNode();
    })
  }

  handleEventDragNode() {
    document.getElementById(this.idNodeSelected)?.addEventListener('mousedown', event => {
      console.log('mouse down = ', event)
      if (event.which === 1) {
        this.showConfigNode = false;
      }
    });
  }

  handleEventNodeCreated() {
    document.addEventListener('nodeCreated', event => {
      // @ts-ignore
      const idNewNodeCreated = event.target.id;
      // @ts-ignore
      const nodeType = event.target.attributes['node_type'].value as TemplateOriginNodeType;
      const propertiesByNodeType = this.nodes.find(node => node.type === nodeType)?.properties;
      if (propertiesByNodeType) {
        this.propertiesOfNodesCreated.push({
          nodeId: idNewNodeCreated,
          properties: propertiesByNodeType
        })
      }
    })
  }

  handleEventNodeRemove() {
    document.addEventListener('nodeRemoved', event => {
      this.showConfigNode = false;
      // @ts-ignore
      const idNodeRemove = `node-${event.target.id}`;
      // @ts-ignore
      this.propertiesOfNodesCreated = this.propertiesOfNodesCreated.filter(propertiesInfoOfNode => propertiesInfoOfNode.nodeId !== idNodeRemove);
    })
  }

  handleEventNodeMoved() {
    document.addEventListener('nodeMoved', event => {
      this.nodeIsMoving = true;
    })
  }

  updatePropertiesNodeSelected() {
    this.propertiesNodeSelected = this.propertiesOfNodesCreated.find(nodeInfo => nodeInfo.nodeId === this.idNodeSelected)?.properties;
  }

  saveNodes() {
    this.nodeFlowChartInfo = [];
    let nodeData = editor.export();
    nodeData = Object.entries(nodeData.drawflow.Home.data);
    nodeData.forEach((value: any) => {
      const nodeInfo = value[1];
      const customNode: NodeChart = {
        nodeId: `node-${nodeInfo.id}`,
        nodeName: nodeInfo.name,
        nodeType: nodeInfo.class as NODE_TYPE,
        properties: this.getPropertiesByNodeId(nodeInfo.id),
        port: {
          in: this.getPortFromNodeInfo(nodeInfo.inputs.input_1?.connections || []),
          out: this.getPortFromNodeInfo(nodeInfo.outputs.output_1?.connections || [])
        }
      }
      this.nodeFlowChartInfo.push(customNode);
    })
    this.showModal = true;
  }

  getPropertiesByNodeId(nodeId: string) {
    const propertyTemporaryByNodeId = this.propertiesOfNodesCreated.find(propertiesInfo => propertiesInfo.nodeId === `node-${nodeId}`);
    return propertyTemporaryByNodeId?.properties
  }

  getPortFromNodeInfo(nodeInfo: any[]) {
    let portInfo: string[] = [];
    nodeInfo.forEach(nodeInDetail => {
      portInfo.push(`node-${nodeInDetail.node}`);
    })
    return portInfo;
  }

  saveConfigNode(formData: any) {
    this.showConfigNode = false;
    let propertiesByNodeSelected = this.propertiesOfNodesCreated.find(property => property.nodeId === this.idNodeSelected);
    if (propertiesByNodeSelected) {
      propertiesByNodeSelected.properties = formData;
    } else {
      this.propertiesOfNodesCreated.push({
        nodeId: this.idNodeSelected,
        properties: formData
      })
    }
    this.updatePropertiesNodeSelected();
  }

  convertObjToJson(node: NodeChartModel) {
    return JSON.stringify(node);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const parentElement = document.getElementsByClassName('parent-node');
    const targetInFormElement = document.getElementsByTagName('form').item(0)?.contains(targetElement);
    let flag = false;
    for (let index = 0; index < parentElement.length; index++) {
      if (parentElement.item(index)?.contains(targetElement)) {
        flag = true;
      }
    }
    this.showConfigNode = targetInFormElement || flag;
    if (this.showConfigNode && this.nodeIsMoving) {
      this.nodeIsMoving = false;
      this.showConfigNode = false;
    }
  }
}
