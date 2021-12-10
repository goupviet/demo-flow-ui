export const URL = '../assets/js/custom.js';

export enum NODE_TYPE {
  SOURCE = 'Source',
  PROCESS = 'Process',
  SINK = 'Sink'
}

export enum TemplateOriginNodeType {
  ORIGIN_NODE_1 = 'ORIGIN_NODE_1',
  ORIGIN_NODE_2 = 'ORIGIN_NODE_2',
  ORIGIN_NODE_3 = 'ORIGIN_NODE_3',
  ORIGIN_NODE_4 = 'ORIGIN_NODE_4',
}

export interface NodeChartModel {
  id: string;
  name: string;
  type: TemplateOriginNodeType;
  properties?: any
}

export interface NodeChart {
  nodeId: string,
  nodeName: string,
  properties?: any,
  port: {
    in: string[],
    out: string[]
  },
  nodeType: NODE_TYPE
}

export interface PropertyTemporary {
  nodeId: string,
  properties: any
}

export const NODE_INIT = [
  {
    id: 'Node 1',
    name: 'Node 1',
    type: TemplateOriginNodeType.ORIGIN_NODE_1,
  },
  {
    id: 'Node 2',
    name: 'Node 2',
    type: TemplateOriginNodeType.ORIGIN_NODE_2,
  },
  {
    id: 'Node 3',
    name: 'Node 3',
    type: TemplateOriginNodeType.ORIGIN_NODE_3,
  },
  {
    id: 'Node 4',
    name: 'Node 4',
    type: TemplateOriginNodeType.ORIGIN_NODE_4,
  }
]
