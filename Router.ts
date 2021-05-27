import { RoutingTree } from "./RoutingTree";
import { RoutingTreeEditor } from "./RoutingTreeEditor";

export class Router {
    private readonly _tree: RoutingTree = new RoutingTree();

    public getTreeEditor(): RoutingTreeEditor {
        return new RoutingTreeEditor(this._tree, this._tree.getOrCreateNodeByPathFormat("/"));
    }

    public parameterSelector: (x) => any;

    public call(path: string): boolean {
        const node = this._tree.resolveNode(path);
        if (!node) {
            return false;
        }

        const controller = node.getController();
        if (!controller) {
            return false;
        }

        let param = node.routingPath.resolveParameter(path);
        if (this.parameterSelector !== null) {
            param = this.parameterSelector(param);
        }
        controller.call(param, node);
        return true;
    }
}