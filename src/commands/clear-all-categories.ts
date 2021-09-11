import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { CLEAR_ALL_CATEGORIES } from '../consts/commands';
import { CLEAR_ALL_CATEGORIES_MSG, NO_MSG, YES_MSG } from '../consts/messages';
import { Command } from './base/command';
import { DataStorageManager } from '../services/data-storage-manager';
import { FAVORITE_REPOS_KEY } from '../consts/application';

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
		vscode.window
			.showInformationMessage(
				CLEAR_ALL_CATEGORIES_MSG,
				...[YES_MSG, NO_MSG]
			)
			.then((answer) => {
				if (answer === 'Yes') {
					this.dataStorageManager
						.clearValues(FAVORITE_REPOS_KEY);
					this.bookmarkManager.categoryRepositories = undefined;
					this.bookmarkManager
						.loadStoredData();
				}
			});
    }
}