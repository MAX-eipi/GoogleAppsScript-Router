import { RoutingController } from "./RoutingController";
import { RoutingNode } from "./RoutingNode";
import { RoutingParameterType } from "./RoutingParameterType";

export class RoutingNodeImpl implements RoutingNode {
    public readonly parent: RoutingNodeImpl = null;
    public readonly path: string;
    public readonly parameterName: string;

    private readonly _children: Record<string, RoutingNodeImpl> = {};

    public constructor(parent: RoutingNodeImpl, path: string, parameterTypeMapping?: Record<string, string>) {
        this.parent = parent;
        if (path.startsWith(":")) {
            this.parameterName = path.substr(1);
            this.path = `:${parameterTypeMapping[this.parameterName]}`;
        }
        else {
            this.path = path;
        }
    }


    public get root(): RoutingNodeImpl {
        return this.parent ? this.parent.root : this;
    }


    public get children(): Readonly<Record<string, RoutingNodeImpl>> {
        return this._children;
    }


    public getOrCreateNode(path: string, parameterTypeMapping?: Record<string, string>): RoutingNodeImpl {
        if (!(path in this._children)) {
            const child = new RoutingNodeImpl(this, path, parameterTypeMapping);
            this._children[child.path] = child;
        }
        if (path.startsWith(":")) {
            path = `:${parameterTypeMapping[path.substr(1)]}`;
        }
        return this._children[path];
    }


    public getNode(path: string, parameters: Record<string, string | number>): RoutingNodeImpl {
        if (path in this._children) {
            return this._children[path];
        }
        if (`:${RoutingParameterType.NUMBER}` in this._children) {
            const num = parseInt(path);
            if (!isNaN(num)) {
                const node = this._children[`:${RoutingParameterType.NUMBER}`];
                parameters[node.parameterName] = num;
                return node;
            }
        }
        if (`:${RoutingParameterType.TEXT}` in this._children) {
            const node = this._children[`:${RoutingParameterType.TEXT}`];
            parameters[node.parameterName] = path;
            return node;
        }
        return null;
    }


    private _controllerFactory: () => RoutingController;
    private _controller: RoutingController;


    public bindController(factory: () => RoutingController): void {
        this._controllerFactory = factory;
    }


    public registerContoller(controller: RoutingController): void {
        this._controller = controller;
    }


    public getController(): RoutingController {
        if (!this._controller) {
            this._controller = this._controllerFactory();
        }
        return this._controller;
    }

    public createFullPath(parameters: any): string {
        let fullPath = "/" + this.getValue(parameters);
        let current = this.parent;
        while (current?.parent) {
            fullPath = "/" + current.getValue(parameters) + fullPath;
            current = current.parent;
        }
        return fullPath;
    }

    private getValue(parameters: any): string {
        return this.parameterName ? parameters[this.parameterName].toString() : this.path;
    }
} 