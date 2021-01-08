import { RoutingNodeImpl } from "./RoutingNodeImpl";
import { RoutingController, RoutingControllerWithType } from "./RoutingController";

export class RoutingNodeHandler {
    protected readonly currentNode: RoutingNodeImpl;

    public constructor(node: RoutingNodeImpl) {
        this.currentNode = node;
    }

    public createNode(path: string, parameterTypeMapping?: Record<string, string>): RoutingNodeHandler {
        const node = this.getOrCreateTargetNode(path, parameterTypeMapping);
        return new RoutingNodeHandler(node);
    }

    protected getOrCreateTargetNode(path: string, parameterTypeMapping?: Record<string, string>): RoutingNodeImpl {
        while (path.startsWith("/")) {
            path = path.substr(1);
        }
        while (path.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        if (!path) {
            return this.currentNode;
        }
        const layers = path.split('/');
        let current = this.currentNode;
        for (const layer of layers) {
            current = current.getOrCreateNode(layer, parameterTypeMapping);
        }
        return current;
    }

    public bindController(factory: () => RoutingController): void {
        this.currentNode.bindController(factory);
    }

    public registerController(controller: RoutingController): void {
        this.currentNode.registerContoller(controller);
    }
}

export class RoutingNodeHandlerWithType<T> extends RoutingNodeHandler {

    public constructor(node: RoutingNodeImpl) {
        super(node);
    }

    public createNode(path: string, parameterTypeMapping?: Record<string, string>): RoutingNodeHandlerWithType<T> {
        const node = this.getOrCreateTargetNode(path, parameterTypeMapping);
        return new RoutingNodeHandlerWithType<T>(node);
    }

    public createNodeWithType<U>(path: string, parameterTypeMapping?: { [P in keyof U]: string }): RoutingNodeHandlerWithType<T & U> {
        const node = this.getOrCreateTargetNode(path, parameterTypeMapping);
        return new RoutingNodeHandlerWithType<T & U>(node);
    }

    public bindController(factory: () => RoutingControllerWithType<T>): void {
        this.currentNode.bindController(factory);
    }

    public registerController(controller: RoutingControllerWithType<T>): void {
        this.currentNode.registerContoller(controller);
    }
}