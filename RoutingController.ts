import { RoutingNode } from "./RoutingNode";

export interface RoutingController {
    call(parameter, node: RoutingNode);
}
