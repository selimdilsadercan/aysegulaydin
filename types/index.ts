import { Database } from "./database";

export type Settings = Database["public"]["Tables"]["setttings"]["Row"];
export type Node = Database["public"]["Tables"]["nodes"]["Row"];
export type ExtraNode = Database["public"]["Tables"]["nodes_extras"]["Row"];
export type ExtendedNode = Node & { nodes_extras: ExtraNode[] };
export type Type = Database["public"]["Enums"]["type"] | "recent";
