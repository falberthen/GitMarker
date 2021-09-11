import * as vscode from 'vscode';
import * as fs from 'fs';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { ERROR_EXPORTING_MSG } from '../consts/messages';
import { saveDialogOptions } from '../utils/dialog-options';
import { EXPORT_BOOKMARKS } from '../consts/commands';
import { Command } from './base/command';
import BookmarkManager from '../services/bookmark-manager';

@injectable()
export class ExportBookmarks implements Command {

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager
	) {}
	
	get id() {
		return EXPORT_BOOKMARKS;
	}

	async execute() {
		await vscode.window.showSaveDialog(saveDialogOptions)
		.then(file => {
			if(file) {
				const categoryRepositories = this.bookmarkManager.categoryRepositories;		
				const serializedObj = JSON.stringify(categoryRepositories);

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