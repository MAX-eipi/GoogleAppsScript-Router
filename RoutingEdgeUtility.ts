class RoutingEdgeUtility {
    public static createEdgeFromPathFormat(pathFormat: string): RoutingEdge {
        if (pathFormat.indexOf(":") !== -1) {
            const x = pathFormat.split(":");
            return this.createEdge(x[0], x[1]);
        }
        else {
            return this.createEdge(pathFormat, null);
        }
    }

    public static createEdge(name: string, type: string): RoutingEdge {
        return {
            name: name,
            type: type,
        };
    }

    public static toPathFormat(edge: RoutingEdge): string {
        if (edge.type) {
            return `${edge.name}:${edge.type}`;
        }
        else {
            return edge.name;
        }
    }
}
