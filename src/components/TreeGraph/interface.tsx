import type { TraitStatus } from '../../interface/application';
import type { ResourceTreeNode } from '../../interface/observation';

export interface TreeNode {
  resource: ResourceTreeNode;
  nodeType: 'app' | 'cluster' | 'component' | 'trait' | 'policy' | 'resource' | 'pod' | 'target';
  leafNodes?: TreeNode[];
}

export interface Node {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GraphNode extends Node, TreeNode {}

export interface TraitGraphNode extends Node {
  trait?: TraitStatus;
}

export interface GraphEdge {
  points?: { x: number; y: number }[];
  [key: string]: any;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
