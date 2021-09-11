import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { RENAME_CATEGORY } from '../consts/commands';
import { Command } from './base/command';
import TYPES from './base/types';
import { Category } from '../models/category';

@injectable()
export class RenameCategory implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
	) {}
	
	get id() {
		return RENAME_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		const existingCategory: Category = this.bookmarkManager.categoryRepositories!.categories
			?.filter(ec => ec.id === dataItem.id)[0];
		
		let newName = await vscode.window.showInputBox({
			value: existingCategory.name,
			placeHolder:  `${TYPE_NAME_CATEGORY_MSG} ${existingCategory.name}`,
		});
	
		if(typeof newName !== 'undefined' && newName) {
			this.bookmarkManager
				.renameCategory(dataItem, newName);
		}
	}
}