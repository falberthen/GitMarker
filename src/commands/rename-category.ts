import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { CATEGORY_ERR_NAME_REQUIRED, CATEGORY_PLEASE_SELECT } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { RENAME_CATEGORY } from '../consts/commands';
import { Command } from './base/command';
import { CategoryModel } from '../models/category-model';

@injectable()
export class RenameCategory implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager
	) {}
	
	get id() {
		return RENAME_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		const existingCategory: CategoryModel = this.bookmarkManager
			.categoryRepositories!.categories
			?.filter(ec => ec.id === dataItem.id)[0];
		
		await vscode.window.showInputBox({
			value: existingCategory.name,
			placeHolder:  `${CATEGORY_PLEASE_SELECT}`,
		})
		.then(async newName => {
			let trimmedNewName = newName?.trim();
			if(typeof newName === 'undefined') { // no action
				return;
			}
			if(trimmedNewName === '') {
				vscode.window.showErrorMessage(CATEGORY_ERR_NAME_REQUIRED);
				return;
			}

			this.bookmarkManager
					.renameCategory(dataItem, trimmedNewName!);
		});
	}
}