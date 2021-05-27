import { RoutingNode } from "./RoutingNode";
import { RoutingTree } from "./RoutingTree";
import { RoutingPath } from "./RoutingPath";

export class RoutingTreeEditor {
    private readonly _tree: RoutingTree;
    public readonly node: RoutingNode;

    public constructor(tree: RoutingTree, node: RoutingNode) {
        this._tree = tree;
        this.node = node;
    }

    public build(pathFormat: string): RoutingTreeEditor {
        const path = this.node !== null
            ? RoutingPath.combine(this.node.routingPath, new RoutingPath(pathFormat))
            : new RoutingPath(pathFormat);
        const node = this._tree.getOrCreateNode(path);
        return new RoutingTreeEditor(this._tree, node);
    }
}