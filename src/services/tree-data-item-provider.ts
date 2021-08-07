import * as vscode from 'vscode';
import { TreeDataProvider } from 'vscode';
import { TreeDataItem } from '../models/tree-data-item';

export class TreeDataItemProvider implements TreeDataProvider<TreeDataItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<TreeDataItem | undefined>();
	public readonly onDidChangeTreeData: vscode.Event<TreeDataItem | undefined> = this._onDidChangeTreeData.event;
	data: TreeDataItem[] = [];

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem = (node: TreeDataItem) => node;

	getChildren(element?: TreeDataItem|undefined): vscode.ProviderResult<TreeDataItem[]> {
		if (element === undefined) {
			return this.data;
		}

		return element.children;
	}

	setTreeItems(elements: TreeDataItem[]) {      
		this.data = elements;
	}
}