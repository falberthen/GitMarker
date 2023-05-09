import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { CLEAR_ALL_CATEGORIES } from '../consts/commands';
import { CATEGORY_CONFIRM_CLEAR_ALL, 
				 GENERIC_YES_ANSWER, 
				 GENERIC_NO_ANSWER } from '../consts/constants-messages';
import { Command } from './base/command';
import { DataStorageManager } from '../services/data-storage-manager';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { CategoriesRepositoriesModel } from '../models/categories-repositories-model';

@injectable()
export class ClearAllCategories implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
		@inject(TYPES.dataStorageManager) 
		private dataStorageManager: DataStorageManager
	) {}

	get id() {
		return CLEAR_ALL_CATEGORIES;
	}

	async execute() {
		vscode.window.showInformationMessage(
			CATEGORY_CONFIRM_CLEAR_ALL,
			...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
		)
		.then((answer) => {
			if (answer === GENERIC_YES_ANSWER) {
				this.dataStorageManager
					.clearValues(FAVORITE_REPOS_KEY);
				this.bookmarkManager.categoryRepositories = new CategoriesRepositoriesModel();
				this.bookmarkManager.storeAndRefreshProvider();				
			}
		});
	}
}