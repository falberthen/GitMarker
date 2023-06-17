import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { CATEGORY_ERR_NAME_REQUIRED, CATEGORY_PLEASE_SELECT } from '../consts/constants-messages';
import { TreeDataItem } from '../models/tree-data-item';
import { RENAME_CATEGORY } from '../consts/commands';
import { Command } from './base/command';
import { CategoryModel } from '../models/category-model';
import { BookmarkService } from '../services/bookmark-service';

@injectable()
export class RenameCategory implements Command {

	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService
	) {}
	
	get id() {
		return RENAME_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		const existingCategory: CategoryModel = this.bookmarkService
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

			this.bookmarkService
					.renameCategory(dataItem, trimmedNewName!);
		});
	}
}