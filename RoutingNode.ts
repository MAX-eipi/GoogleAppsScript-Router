import { RoutingController } from "./RoutingController";

export interface RoutingNode {
    readonly parent: RoutingNode;

    setParent(parent: RoutingNode): void;
    link(node: RoutingNode): void;

    hasChild(pathFormat: string): boolean;
    getChild(pathFormat: string): RoutingNode;
    addChild(node: RoutingNode): void;
    removeChild(node: RoutingNode): void;

    getNode(path: string, parameters: Record<string, number | string>): RoutingNode;
    getPathFormat(): string;
    getPath(parameters: Record<string, number | string>): string;
    getFullPathFormat(): string;
    getFullPath(parameters: Record<string, number | string>);

    bindController(factory: () => RoutingController): void;
    registerController(controller: RoutingController): void;
    getController(): RoutingController;
}