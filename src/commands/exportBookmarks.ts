import * as vscode from 'vscode';
import * as fs from 'fs';
import { LocalStorageService } from '../services/local-storage-service';
import { Category } from '../models/category';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { ERROR_EXPORTING_MSG } from '../consts/messages';
import { saveDialogOptions } from '../utils/dialog-options';

export async function exportBookmarks(context: vscode.ExtensionContext) {   
	await vscode.window.showSaveDialog(saveDialogOptions)
	.then(file => {
		if(file) {
			const storedCategories = new LocalStorageService(context.workspaceState)
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