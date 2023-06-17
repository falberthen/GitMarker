import * as vscode from 'vscode';
import * as fs from 'fs';
import { inject, injectable} from 'inversify';
import { BOOKMARK_ERR_EXPORTING } from '../consts/constants-messages';
import { saveDialogOptions } from '../utils/dialog-options';
import { EXPORT_BOOKMARKS } from '../consts/commands';
import { Command } from './base/command';
import { BookmarkService } from '../services/bookmark-service';
import TYPES from './base/types';

@injectable()
export class ExportBookmarks implements Command {

	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService
	) {}
	
	get id() {
		return EXPORT_BOOKMARKS;
	}

	async execute() {
		await vscode.window.showSaveDialog(saveDialogOptions)
		.then(file => {
			if(file) {
				const categoryRepositories = this.bookmarkService.categoryRepositories;		
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
					vscode.window.showErrorMessage(BOOKMARK_ERR_EXPORTING);
				}
			}
		});
	}
}