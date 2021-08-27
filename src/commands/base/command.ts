import { TreeDataItem } from "../../models/tree-data-item";

export interface Command {
   id: string;
   execute(dataItem: TreeDataItem): any;
}