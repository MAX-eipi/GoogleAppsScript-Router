class RoutingBindingInfo {
    public readonly node: RoutingNode;
    public readonly edge: RoutingEdge;

    private readonly _children: Record<string, RoutingBindingInfo> = {};

    public constructor(node: RoutingNode, edge: RoutingEdge) {
        this.node = node;
        this.edge = edge;
    }

    public hasChildByName(name: string, type: string): boolean {
        return this.getChildByName(name, type) !== null;
    }

    public hasChildByValue(value: string): boolean {
        return this.getChildByValue(value) !== null;
    }

    public addChild(node: RoutingNode, edge: RoutingEdge): RoutingBindingInfo {
        const bindingInfo = new RoutingBindingInfo(node, edge);
        if (edge.type) {
            this._children[edge.type] = bindingInfo;
        }
        else {
            this._children[edge.name] = bindingInfo;
        }
        return bindingInfo;
    }

    public getChildByName(name: string, type: string): RoutingBindingInfo {
        return this.getChild(name, type);
    }

    public getChildByValue(value: string): RoutingBindingInfo {
        if (!isNaN(parseInt(value))) {
            const child = this.getChild(value, RoutingParameterType.NUMBER);
            if (child !== null) {
                return child;
            }
        }
        return this.getChild(value, RoutingParameterType.TEXT);
    }

    private getChild(key: string, type: string): RoutingBindingInfo {
        if (key in this._children) {
            return this._children[key];
        }
        else if (type && type in this._children) {
            return this._children[type];
        }
        return null;
    }
}
