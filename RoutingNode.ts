import { RoutingController } from "./RoutingController";
import { RoutingPath } from "./RoutingPath";

export class RoutingNode {
    public readonly routingPath: RoutingPath;

    private _controllerFactory: () => RoutingController = null;
    private _controller: RoutingController = null;

    public constructor(routingPath: RoutingPath) {
        this.routingPath = routingPath;
    }

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