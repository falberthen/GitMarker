import * as vscode from 'vscode';
import TYPES from './base/types';
import { BookmarkService } from '../services/bookmark-service';
import { inject, injectable} from 'inversify';
import { CLEAR_ALL_CATEGORIES } from '../consts/commands';
import { CATEGORY_CONFIRM_CLEAR_ALL, 
				 GENERIC_YES_ANSWER, 
				 GENERIC_NO_ANSWER } from '../consts/constants-messages';
import { Command } from './base/command';
import { DataStorageService } from '../services/data-storage-service';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { CategoriesRepositoriesModel } from '../models/categories-repositories-model';

@injectable()
export class ClearAllCategories implements Command {

	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService,
		@inject(TYPES.dataStorageService) 
		private dataStorageService: DataStorageService
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
				this.dataStorageService
					.clearValues(FAVORITE_REPOS_KEY);
				this.bookmarkService.categoryRepositories = new CategoriesRepositoriesModel();
				this.bookmarkService.storeAndRefreshProvider();				
			}
		});
	}
}