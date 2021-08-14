import * as vscode from 'vscode';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import BookmarkManager from '../services/bookmark-manager';

export async function createCategory() {
	await vscode.window.showInputBox({
		value: '',
      placeHolder: TYPE_NAME_CATEGORY_MSG,
   })
	.then(name => {
		if(name) {
			BookmarkManager.instance
            .addCategory(name);
      }      
   });
}