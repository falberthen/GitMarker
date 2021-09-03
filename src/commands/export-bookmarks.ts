import * as vscode from 'vscode';
import * as fs from 'fs';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { ERROR_EXPORTING_MSG } from '../consts/messages';
import { saveDialogOptions } from '../utils/dialog-options';
import { DataStorageManager } from '../services/data-storage-manager';
import { EXPORT_BOOKMARKS } from '../consts/commands';
import { Category } from '../models/category';
import { Command } from './base/command';

@injectable()
export class ExportBookmarks implements Command {

	constructor
	(
		@inject(TYPES.dataStorageManager) 
		private dataStorageManager: DataStorageManager
	) {}
	
	get id() {
		return EXPORT_BOOKMARKS;
	}

	async execute() {
		await vscode.window.showSaveDialog(saveDialogOptions)
		.then(file => {
			if(file) {
				const storedCategories = this.dataStorageManager
					.getValue<Category[]>(FAVORITE_REPOS_KEY);

				const serializedObj = JSON
					.stringify(storedCategories);

				try {
					new Promise((resolve, reject) => {
						fs.writeFile(file.fsPath, serializedObj, writeFileError => {
							if (writeFileError) {
								reject(writeFileError);
								return;
							}
					
							resolve(file.fsPath);
						});            
					});
					
				} catch (error) {
					vscode.window.showErrorMessage(ERROR_EXPORTING_MSG);
				}         
			}
		});
    }
}