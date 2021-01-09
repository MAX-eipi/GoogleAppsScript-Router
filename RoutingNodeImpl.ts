import { RoutingController } from "./RoutingController";
import { RoutingNode } from "./RoutingNode";
import { RoutingParameterType } from "./RoutingParameterType";

interface NodeInfo {
    readonly pathFormat: string;
    readonly key: string;
    readonly parameterName: string;
}

export class RoutingNodeImpl implements RoutingNode {
    private readonly _children: Record<string, RoutingNode> = {};
    private readonly _nodeInfo: NodeInfo;

    private _parent: RoutingNode = null;
    public get parent(): RoutingNode {
        return this._parent;
    }

    public constructor(pathFormat: string) {
        this._nodeInfo = this.createNodeInfo(pathFormat);
    }

    public setParent(parent: RoutingNode): void {
        if (this._parent) {
            this._parent.removeChild(this);
            this._parent = null;
        }
        this._parent = parent;
        this._parent.addChild(this);
    }

    public link(node: RoutingNode): void {
        this.addChild(node);
    }

    public hasChild(pathFormat: string): boolean {
        const key = this.createNodeInfo(pathFormat).key;
        return key in this._children;
    }

    public getChild(pathFormat: string): RoutingNode {
        const key = this.createNodeInfo(pathFormat).key;
        return this._children[key];
    }

    public addChild(node: RoutingNode): void {
        const nodeInfo = this.createNodeInfo(node.getPathFormat());
        if (!(nodeInfo.key in this._children)) {
            this._children[nodeInfo.key] = node;
        }
        else {
            throw new Error(`A node with the same key is already registered. self: ${this.getFullPathFormat()}, request: ${nodeInfo.pathFormat}`);
        }
    }

    public removeChild(node: RoutingNode): void {
        const nodeInfo = this.createNodeInfo(node.getPathFormat());
        if (nodeInfo.key in this._children) {
            delete this._children[nodeInfo.key];
        }
    }

    private createNodeInfo(pathFormat: string): NodeInfo {
        const ret = {
            pathFormat: pathFormat,
            key: null,
            parameterName: null,
        };
        if (pathFormat.indexOf(":") !== -1) {
            const x = pathFormat.split(":");
            ret.parameterName = x[0];
            ret.key = x[1];
        }
        else {
            ret.key = pathFormat;
        }
        return ret;
    }

    public getNode(path: string, parameters: Record<string, number | string>): RoutingNode {
        while (path?.startsWith("/")) {
            path = path.substr(1);
        }
        while (path?.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        if (!path) {
            return this;
        }
        const layers = path.split("/");
        const nextLayer = layers[0];
        if (nextLayer in this._children) {
            return this._children[nextLayer].getNode(layers.slice(1).join("/"), parameters);
        }
        else if (RoutingParameterType.NUMBER in this._children) {
            const num = parseInt(nextLayer);
            if (!isNaN(num)) {
                const node = this._children[RoutingParameterType.NUMBER];
                const nodeInfo = this.createNodeInfo(node.getPathFormat());
                parameters[nodeInfo.parameterName] = num;
                return node.getNode(layers.slice(1).join("/"), parameters);
            }
        }
        else if (RoutingParameterType.TEXT in this._children) {
            const node = this._children[RoutingParameterType.TEXT];
            const nodeInfo = this.createNodeInfo(node.getPathFormat());
            parameters[nodeInfo.parameterName] = nextLayer;
            return node.getNode(layers.slice(1).join("/"), parameters);
        }
        return null;
    }

    public getPathFormat(): string {
        return this._nodeInfo.pathFormat;
    }

    public getPath(parameters: Record<string, number | string>): string {
        if (this._nodeInfo.parameterName) {
            return parameters[this._nodeInfo.parameterName].toString();
        }
        return this._nodeInfo.key;
    }

    public getFullPathFormat(): string {
        if (this.parent) {
            return this.parent.getFullPathFormat() + "/" + this.getPathFormat();
        }
        else {
            const pathFormat = this.getPathFormat();
            return pathFormat ? "/" + pathFormat : "";
        }
    }

    public getFullPath(parameters: Record<string, number | string>): string {
        if (this.parent) {
            return this.parent.getFullPath(parameters) + "/" + this.getPath(parameters);
        }
        else {
            const path = this.getPath(parameters);
            return path ? "/" + path : "";
        }
    }

    private _controllerFactory: () => RoutingController = null;
    private _controller: RoutingController = null;

    public bindController(factory: () => RoutingController): void {
        this._controllerFactory = factory;
    }

    public registerController(controller: RoutingController): void {
        this._controller = controller;
    }

    public getController(): RoutingController {
        if (!this._controller && this._controllerFactory) {
            this._controller = this._controllerFactory();
        }
        return this._controller;
    }
} 