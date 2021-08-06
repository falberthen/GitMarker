import path = require('path');
import * as vscode from 'vscode';
import { Command, Uri } from 'vscode';
import { icons } from '../consts/icons';

export class TreeDataItem extends vscode.TreeItem {
	children: TreeDataItem[] | undefined;
	url!: Uri;
	isRoot: boolean = false;
	parentId!: string | undefined;

	constructor(label: string, children?: TreeDataItem[], parentId?: string, command?: Command) {
		super(
			label,
			parentId 
				? vscode.TreeItemCollapsibleState.None
				: vscode.TreeItemCollapsibleState.Expanded
   	);   
      
		const isRoot = parentId ? false : true;
		this.id = this.generateUniqueID();	
		this.parentId = parentId;	
		this.children = children;
		this.contextValue = isRoot ? 'categoryItem' : 'treeItem';

		const icon = isRoot ? icons.favorite : icons.github;
		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', icons.light, icon),
			dark: path.join(__filename, '..', '..', '..', 'resources', icons.dark, icon)
		};

   	if(command !== undefined) {
			this.command = command;
		} 
   }

	generateUniqueID(){
		return '_' + Math.random()
		.toString(36).substr(2, 9);
	};
}

