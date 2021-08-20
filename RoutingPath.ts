import { RoutingEdge, RoutingEdgeUtility } from "./RoutingEdge";
import { RoutingParameterType } from "./RoutingParameterType";

export class RoutingPath {
    public readonly pathFormat: string;
    public readonly edges: RoutingEdge[];

    public constructor(pathFormat: string) {
        this.pathFormat = pathFormat;
        this.edges = RoutingPath.parse(pathFormat);
    }

    public isRoot(): boolean {
        return RoutingPath.isRootPath(this.pathFormat) || this.edges.length === 0;
    }

    public resolveParameter(path: string) {
        if (this.isRoot()) {
            return {};
        }

        const parameter = {};
        path = RoutingPath.normalizePathFormat(path);
        const values = path.split("/");
        for (let i = 0; i < values.length; i++) {
            const edge = this.edges[i];
            const value = decodeURI(values[i]);
            if (edge.type) {
                switch (edge.type) {
                    case RoutingParameterType.NUMBER:
                        parameter[edge.name] = parseInt(value);
                        break;
                    case RoutingParameterType.TEXT:
                        parameter[edge.name] = value;
                        break;
                }
            }
        }
        return parameter;
    }

    public resolvePath(parameter): string {
        if (this.isRoot()) {
            return "/";
        }

        let path = "";
        for (const edge of this.edges) {
            if (edge.type) {
                path += `/${parameter[edge.name]}`;
            }
            else {
                path += `/${edge.name}`;
            }
        }
        return path;
    }

    public static isRootPath(path: string): boolean {
        return !path || path === "/";
    }

    public static normalizePathFormat(pathFormat: string): string {
        while (pathFormat.startsWith("/")) {
            pathFormat = pathFormat.substr(1);
        }
        while (pathFormat.endsWith("/")) {
            pathFormat = pathFormat.substr(0, pathFormat.length - 1);
        }
        return pathFormat;
    }

    public static parse(pathFormat: string): RoutingEdge[] {
        pathFormat = this.normalizePathFormat(pathFormat);
        if (!pathFormat) {
            return [];
        }

        const edges: RoutingEdge[] = [];
        const layers = pathFormat.split("/");
        for (const layer of layers) {
            edges.push(RoutingEdgeUtility.createEdgeFromPathFormat(layer));
        }
        return edges;
    }

    public static toPathFormat(edges: RoutingEdge[]): string {
        return edges.map(RoutingEdgeUtility.toPathFormat).join('/');
    }

    public static instantiateFromEdges(edges: RoutingEdge[]): RoutingPath {
        return new RoutingPath(this.toPathFormat(edges));
    }

    public static combine(...paths: RoutingPath[]): RoutingPath {
        const edges: RoutingEdge[] = [];
        for (const path of paths) {
            for (const edge of path.edges) {
                edges.push(edge);
            }
        }
        return this.instantiateFromEdges(edges);
    }
}
