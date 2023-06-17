import * as vscode from 'vscode';
import { BookmarkService } from '../services/bookmark-service';
import { inject, injectable} from 'inversify';
import { GENERIC_QUESTION_REMOVING,
	GENERIC_YES_ANSWER, GENERIC_NO_ANSWER } from '../consts/constants-messages';
import { REMOVE_CATEGORY } from '../consts/commands';
import { TreeDataItem } from '../models/tree-data-item';
import { Command } from './base/command';
import TYPES from './base/types';
import { CategoryModel } from '../models/category-model';

@injectable()
export class RemoveCategory implements Command {

	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService,
	) {}
	
	get id() {
		return REMOVE_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
		const existingCategory : CategoryModel = this.bookmarkService
			.categoryRepositories!.categories
			?.filter(ec => ec.id === dataItem.id)[0];
			
		vscode.window
		.showInformationMessage(
			`${GENERIC_QUESTION_REMOVING} ${existingCategory.name}?`,
			...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
		)
		.then((answer) => {
			if (answer === GENERIC_YES_ANSWER) {
				this.bookmarkService.removeCategory(dataItem);
			}
		});
	}
}