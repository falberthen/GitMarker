import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { injectable} from 'inversify';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { RENAME_CATEGORY } from '../consts/commands';
import { Command } from './base/command';

@injectable()
export class RenameCategory implements Command {

	get id() {
		return RENAME_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		let newName = await vscode.window.showInputBox({
			value: dataItem.label?.toString(),
			placeHolder:  `${TYPE_NAME_CATEGORY_MSG} ${dataItem.label}`,
		});
	
		if(typeof newName !== 'undefined' && newName) {
			BookmarkManager.instance
				.renameCategory(dataItem, newName);
		}
	}
}