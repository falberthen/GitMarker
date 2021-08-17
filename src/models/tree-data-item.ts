import * as vscode from 'vscode';
import { Command, Uri } from 'vscode';
import { CATEGORY_ICON, DARK_THEME, GITHUB_ICON, LIGHT_THEME } from '../consts/icons';
import { VIEW_ITEM_CATEGORY, VIEW_ITEM_REPOSITORY } from '../consts/application';
import path = require('path');

export class TreeDataItem extends vscode.TreeItem {
	children: TreeDataItem[] | undefined;
	parentId!: string;
	customId!: string;
	url!: Uri;

	constructor(isRoot: boolean, label: string, children?: TreeDataItem[], command?: Command) {
		super(
			label,
			isRoot 
				? vscode.TreeItemCollapsibleState.Expanded
				: vscode.TreeItemCollapsibleState.None
   	);

		this.children = children;
		this.contextValue = isRoot 
			? VIEW_ITEM_CATEGORY 
			: VIEW_ITEM_REPOSITORY;
		
		const icon = isRoot 
			? CATEGORY_ICON 
			: GITHUB_ICON;

		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', 'resources', LIGHT_THEME, icon),
			dark: path.join(__filename, '..', '..', '..', 'resources', DARK_THEME, icon)
		};

   	if(command !== undefined) {
			this.command = command;
		} 
   }
}