import * as vscode from 'vscode';
import * as fs from 'fs';
import {
	ARE_YOU_SURE_IMPORT_MSG, 
	ERROR_IMPORTING_MSG, 
	NO_MSG, YES_MSG } from '../consts/messages';
import { plainToClass } from 'class-transformer';
import { GithubRepository } from '../models/github-repository';
import { openDialogOptions } from '../utils/dialog-options';
import { CategoriesRepositories } from '../models/categories-repositories';
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
			this.bookmarkManager.categoryRepositories = new CategoriesRepositories();
		}

		const hasRepositories = this.bookmarkManager
			.categoryRepositories!.repositories.length > 0;

		if(hasRepositories) {
			vscode.window.showInformationMessage(
				ARE_YOU_SURE_IMPORT_MSG,
				...[YES_MSG, NO_MSG]
			)
			.then((answer) => {
				if (answer === 'Yes') {
					this.pickFolder();
				}
			});
		}
		else{
			await this.pickFolder();
		}
	}

	async pickFolder() {
		return await vscode.window
		.showOpenDialog(openDialogOptions)
			.then(fileUri => {
				if (fileUri && fileUri[0]) {
					fs.readFile(fileUri[0].fsPath, 'utf8' , (err, data) => {
					if (err) {
						console.error(err);
						return;
					}

					this.validateImport(data);
				});
			}
		});
	}
	
	async validateImport(data: string) {
		try {
			const parsedObject = JSON.parse(data);
			const categoriesRepositories = plainToClass(CategoriesRepositories, parsedObject);
			categoriesRepositories.repositories.forEach(parsedRepository => {
				const repository  = plainToClass(GithubRepository, parsedRepository);
				if(repository) {
					repository.setCloneUrl();
				}
			});

			this.bookmarkManager.categoryRepositories = categoriesRepositories;
			this.bookmarkManager.storeAndRefreshProvider();
		} catch (error) {
			vscode.window.showErrorMessage(ERROR_IMPORTING_MSG);
		}
	}
}