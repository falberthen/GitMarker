import * as vscode from 'vscode';
import * as fs from 'fs';
import {
	BOOKMARK_IMPORT_QUESTION, 
	BOOKMARK_ERR_IMPORTING, 
	GENERIC_YES_ANSWER, GENERIC_NO_ANSWER 
} from '../consts/constants-messages';
import { plainToClass } from 'class-transformer';
import { GithubRepositoryModel } from '../models/github-repository-model';
import { openDialogOptions } from '../utils/dialog-options';
import { CategoriesRepositoriesModel } from '../models/categories-repositories-model';
import { IMPORT_BOOKMARKS } from '../consts/commands';
import { inject, injectable } from 'inversify';
import { Command } from './base/command';
import BookmarkManager from '../services/bookmark-manager';
import TYPES from './base/types';

@injectable()
export class ImportBookmarks implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
	) {}
	
	get id() {
		return IMPORT_BOOKMARKS;
	}

	async execute() {
		if(!this.bookmarkManager.categoryRepositories) {
			this.bookmarkManager.categoryRepositories = new CategoriesRepositoriesModel();
		}

		const hasRepositories = this.bookmarkManager
			.categoryRepositories!.repositories.length > 0;

		if(hasRepositories) {
			vscode.window.showInformationMessage(
				BOOKMARK_IMPORT_QUESTION,
				...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
			)
			.then((answer) => {
				if (answer === GENERIC_YES_ANSWER) {
					this.pickFolder();
				}
			});
		}
		else{
			await this.pickFolder();
		}
	}

	private async pickFolder() {
		return await vscode.window
		.showOpenDialog(openDialogOptions)
			.then(fileUri => {
				try {
					if (fileUri && fileUri[0]) {
						fs.readFile(fileUri[0].fsPath, 'utf8' , (err, data) => {
							if (err) {
								console.error(err);
								return;
							}

							this.validateAndImport(data);
						});
					}
				}
				catch (error) {
					vscode.window.showErrorMessage(BOOKMARK_ERR_IMPORTING);
				}
		});
	}
	
	private async validateAndImport(data: string) {
		const parsedObject = JSON.parse(data);
		const categoriesRepositories = plainToClass(CategoriesRepositoriesModel, parsedObject);

		if(categoriesRepositories.categories.length === 0) {
			vscode.window.showErrorMessage(BOOKMARK_ERR_IMPORTING);
			return;
		}

		// Adding and updating objects in the data storage
		categoriesRepositories.repositories.forEach(storedRepository => {
			const repository  = plainToClass(GithubRepositoryModel, storedRepository);			
			if(repository) {
				// updating stored object
				let index = categoriesRepositories.repositories
				.indexOf(storedRepository);
				categoriesRepositories!.repositories[index] = repository;
			}

			this.bookmarkManager.categoryRepositories = categoriesRepositories;
			this.bookmarkManager.storeAndRefreshProvider();
		});		
	}
}