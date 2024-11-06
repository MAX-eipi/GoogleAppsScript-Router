class RoutingTree {
    private readonly root: RoutingBindingInfo;

    public constructor() {
        const path = new RoutingPath("/")
        const node = new RoutingNode(path);
        this.root = new RoutingBindingInfo(node, null);
    }

    public getOrCreateNodeByPathFormat(pathFormat: string): RoutingNode {
        return this.getOrCreateNode(new RoutingPath(pathFormat));
    }

    public getOrCreateNode(routingPath: RoutingPath): RoutingNode {
        if (routingPath.isRoot()) {
            return this.root.node;
        }

        let current = this.root;
        const edges: RoutingEdge[] = [];
        for (const edge of routingPath.edges) {
            edges.push(edge);
            if (current.hasChildByName(edge.name, edge.type)) {
                current = current.getChildByName(edge.name, edge.type);
            }
            else {
                const node = new RoutingNode(RoutingPath.instantiateFromEdges(edges));
                current = current.addChild(node, edge);
            }
        }
        return current.node;
    }

    public resolveNode(path: string): RoutingNode {
        let current = this.root;
        path = RoutingPath.normalizePathFormat(path);
        if (!RoutingPath.isRootPath(path)) {
            const values = path.split("/");
            for (const value of values) {
                if (current.hasChildByValue(value)) {
                    current = current.getChildByValue(value);
                }
                else {
                    return null;
                }
            }
        }
        return current.node;
    }
}
