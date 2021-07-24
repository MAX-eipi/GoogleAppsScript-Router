import { RoutingTree } from "./RoutingTree";
import { RoutingTreeEditor } from "./RoutingTreeEditor";

export class Router {
    private readonly _tree: RoutingTree = new RoutingTree();

    public getTreeEditor(): RoutingTreeEditor {
        return new RoutingTreeEditor(this._tree, this._tree.getOrCreateNodeByPathFormat("/"));
    }

    private _parameterSelector: (x) => any = x => x;

    public set parameterSelector(x: (x) => any) {
        this._parameterSelector = (x !== null) ? x : x => x;
    }

    public call(path: string) {
        const node = this._tree.resolveNode(path);
        if (!node) {
            return null;
        }

        const controller = node.getController();
        if (!controller) {
            return null;
        }

        let param = node.routingPath.resolveParameter(path);
        param = this._parameterSelector(param);
        param = node.parameterSelector(param);
        return controller.call(param, node);
    }
}
