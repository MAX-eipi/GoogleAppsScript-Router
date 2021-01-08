import { RoutingNode } from "./RoutingNode";

export interface RoutingController {
    call(parameter: any, node: RoutingNode);
}

export interface RoutingControllerWithType<T> {
    call(parameter: Readonly<T>, node: RoutingNode);
}