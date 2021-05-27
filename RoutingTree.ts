import { RoutingEdge } from "./RoutingEdge";
import { RoutingNode } from "./RoutingNode";
import { RoutingParameterType } from "./RoutingParameterType";
import { RoutingPath } from "./RoutingPath";

class RoutingBindingInfo {
    public readonly node: RoutingNode;
    public readonly edge: RoutingEdge;

    private readonly _children: Record<string, RoutingBindingInfo> = {};

    public constructor(node: RoutingNode, edge: RoutingEdge) {
        this.node = node;
        this.edge = edge;
    }

    public hasChildByName(name: string, type: string): boolean {
        return this.getChildByName(name, type) !== null;
    }

    public hasChildByValue(value: string): boolean {
        return this.getChildByValue(value) !== null;
    }

    public addChild(node: RoutingNode, edge: RoutingEdge): RoutingBindingInfo {
        const bindingInfo = new RoutingBindingInfo(node, edge);
        if (edge.type) {
            this._children[edge.type] = bindingInfo;
        }
        else {
            this._children[edge.name] = bindingInfo;
        }
        return bindingInfo;
    }

    public getChildByName(name: string, type: string): RoutingBindingInfo {
        return this.getChild(name, type);
    }

    public getChildByValue(value: string): RoutingBindingInfo {
        const type = !isNaN(parseInt(value))
            ? RoutingParameterType.NUMBER
            : RoutingParameterType.TEXT;
        return this.getChild(value, type);
    }

    private getChild(key: string, type: string): RoutingBindingInfo {
        if (key in this._children) {
            return this._children[key];
        }
        else if (type && type in this._children) {
            return this._children[type];
        }
        return null;
    }
}

export class RoutingTree {
    private readonly root: RoutingBindingInfo;

    public constructor() {
        const path = new RoutingPath("/")
        const node = new RoutingNode(path);
        this.root = new RoutingBindingInfo(node, null);
    }

    public getOrCreateNodeByPathFormat(pathFormat: string): RoutingNode {
        return this.getOrCreateNode(new RoutingPath(pathFormat));
    }

    public getOrCreateNode(routingPath: RoutingPath): RoutingNode {
        if (routingPath.isRoot()) {
            return this.root.node;
        }

        let current = this.root;
        const edges: RoutingEdge[] = [];
        for (const edge of routingPath.edges) {
            edges.push(edge);
            if (current.hasChildByName(edge.name, edge.type)) {
                current = current.getChildByName(edge.name, edge.type);
            }
            else {
                const node = new RoutingNode(RoutingPath.instantiateFromEdges(edges));
                current = current.addChild(node, edge);
            }
        }
        return current.node;
    }

    public resolveNode(path: string): RoutingNode {
        let current = this.root;
        path = RoutingPath.normalizePathFormat(path);
        if (!RoutingPath.isRootPath(path)) {
            const values = path.split("/");
            for (const value of values) {
                if (current.hasChildByValue(value)) {
                    current = current.getChildByValue(value);
                }
                else {
                    return null;
                }
            }
        }
        return current.node;
    }
}