import { Router } from "./Router";
import { RoutingController, RoutingControllerWithType } from "./RoutingController";
import { RoutingNode } from "./RoutingNode";

export class RoutingNodeHandler {
    protected readonly router: Router;
    protected readonly node: RoutingNode;

    public constructor(router: Router, node: RoutingNode) {
        this.router = router;
        this.node = node;
    }

    public getOrCreateNode(path: string, name?: string | Function): RoutingNodeHandler {
        return this.router.getOrCreateNode(path, name, this.node);
    }

    public castOf<T extends Record<string, number | string>>(): RoutingNodeHandlerWithType<T> {
        return new RoutingNodeHandlerWithType<T>(this.router, this.node);
    }

    public getFullPath(parameters: Record<string, number | string>): string {
        return this.node.getFullPath(parameters);
    }

    public bindController(factory: () => RoutingController): void {
        this.node.bindController(factory);
    }

    public registerController(controller: RoutingController): void {
        this.node.registerController(controller);
    }
}

export class RoutingNodeHandlerWithType<T extends Record<string, number | string>> extends RoutingNodeHandler {
    public constructor(router: Router, node: RoutingNode) {
        super(router, node);
    }

    public getOrCreateNode(path: string, name?: string | Function): RoutingNodeHandlerWithType<T> {
        return this.router.getOrCreateNodeWithType<T>(path, name, this.node);
    }

    public getOrCreateNodeWithType<U>(path: string, name?: string | Function): RoutingNodeHandlerWithType<T & U> {
        return this.router.getOrCreateNodeWithType<T & U>(path, name, this.node);
    }

    public getFullPath(parameters: T): string {
        return this.node.getFullPath(parameters);
    }

    public bindController(factory: () => RoutingControllerWithType<T>): void {
        this.node.bindController(factory);
    }

    public registerController(controller: RoutingControllerWithType<T>): void {
        this.node.registerController(controller);
    }
}