import { RoutingNode } from "./RoutingNode";

export interface RoutingController {
    call(parameter: any, node: RoutingNode);
}