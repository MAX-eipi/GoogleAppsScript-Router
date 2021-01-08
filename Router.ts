import { RoutingNodeHandler, RoutingNodeHandlerWithType } from "./RoutingNodeHandler";
import { RoutingNodeImpl } from "./RoutingNodeImpl";

export class Router {
    private readonly rootNode: RoutingNodeImpl = new RoutingNodeImpl(null, "");
    private readonly rootNodeHandler: RoutingNodeHandler = new RoutingNodeHandler(this.rootNode);
    private readonly rootNodeHandlerWithType: RoutingNodeHandlerWithType<{}> = new RoutingNodeHandlerWithType<{}>(this.rootNode);

    public createNode(path: string, parameterTypeMapping?: Record<string, string>): RoutingNodeHandler {
        return this.rootNodeHandler.createNode(path, parameterTypeMapping);
    }

    public createNodeWithType<T>(path: string, parameterTypeMapping?: { [P in keyof T]: string }): RoutingNodeHandlerWithType<T> {
        return this.rootNodeHandlerWithType.createNodeWithType<T>(path, parameterTypeMapping);
    }

    public call(path: string): any {
        const parameters = {};
        const node = this.getTargetNode(path, parameters);
        node?.getController().call(parameters, node);
    }

    private getTargetNode(path: string, parameters: Record<string, string | number>): RoutingNodeImpl {
        while (path.startsWith("/")) {
            path = path.substr(1);
        }
        while (path.endsWith("/")) {
            path = path.substr(0, path.length - 1);
        }
        if (!path) {
            return this.rootNode;
        }
        const layers = path.split('/');
        let current = this.rootNode;
        for (const layer of layers) {
            current = current.getNode(layer, parameters);
            if (!current) {
                return null;
            }
        }
        return current;
    }
}