import { RoutingNodeHandler, RoutingNodeHandlerWithType } from "./RoutingNodeHandler";
import { RoutingNodeImpl } from "./RoutingNodeImpl";
import { RoutingNode } from "./RoutingNode";

export class Router {
    private readonly rootNode: RoutingNodeImpl = new RoutingNodeImpl("");
    private readonly nodeTable: Record<string, RoutingNode> = {};

    public getOrCreateNode(path: string, name?: string | Function, root?: RoutingNode): RoutingNodeHandler {
        const node = this.getOrCreateNodeInternal(path, root);
        if (name) {
            if (name instanceof Function) {
                this.nodeTable[name.name] = node;
            }
            else {
                this.nodeTable[name] = node;
            }
        }
        return new RoutingNodeHandler(this, node);
    }

    public getOrCreateNodeWithType<T extends Record<string, number | string>>(path: string, name?: string | Function, root?: RoutingNode): RoutingNodeHandlerWithType<T> {
        const node = this.getOrCreateNodeInternal(path, root);
        if (name) {
            if (name instanceof Function) {
                this.nodeTable[name.name] = node;
            }
            else {
                this.nodeTable[name] = node;
            }
        }
        return new RoutingNodeHandlerWithType<T>(this, node);
    }

    private getOrCreateNodeInternal(path: string, root: RoutingNode): RoutingNode {
        if (!root) {
            root = this.rootNode;
        }
        while (path.startsWith("/")) {
            path = path.substr(1);
        }
        while (path.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        if (!path) {
            return root;
        }

        const layers = path.split("/");
        let current = root;
        for (const layer of layers) {
            if (current.hasChild(layer)) {
                current = current.getChild(layer);
            }
            else {
                const node = new RoutingNodeImpl(layer);
                node.setParent(current);
                current = node;
            }
        }
        return current;
    }

    public findNodeByName(name: string | Function): RoutingNodeHandler {
        if (name instanceof Function) {
            name = name.name;
        }
        return name in this.nodeTable ? new RoutingNodeHandler(this, this.nodeTable[name]) : null;
    }

    public call(path: string): any {
        const parameters = {};
        const node = this.rootNode.getNode(path, parameters);
        const controller = node?.getController();
        controller?.call(parameters, node);
    }
}