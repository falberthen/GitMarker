import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { GENERIC_QUESTION_REMOVING,
	GENERIC_YES_ANSWER, GENERIC_NO_ANSWER } from '../consts/messages';
import { REMOVE_CATEGORY } from '../consts/commands';
import { TreeDataItem } from '../models/tree-data-item';
import { Command } from './base/command';
import TYPES from './base/types';
import { CategoryModel } from '../models/category-model';

@injectable()
export class RemoveCategory implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
	) {}
	
	get id() {
		return REMOVE_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		const existingCategory : CategoryModel = this.bookmarkManager
			.categoryRepositories!.categories
			?.filter(ec => ec.id === dataItem.id)[0];
			
		vscode.window
		.showInformationMessage(
			`${GENERIC_QUESTION_REMOVING} ${existingCategory.name}?`,
			...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
		)
		.then((answer) => {
			if (answer === GENERIC_YES_ANSWER) {
				this.bookmarkManager.removeCategory(dataItem);
			}
		});
	}
}