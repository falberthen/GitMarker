import * as vscode from 'vscode';
import { SURE_REMOVING_MSG, YES_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { NO_MSG } from './../consts/messages';
import BookmarkManager from '../services/bookmark-manager';

export async function removeCategory(dataItem: TreeDataItem) {
	vscode.window
		.showInformationMessage(
			`${SURE_REMOVING_MSG} ${dataItem.label}?`,
			...[YES_MSG, NO_MSG]
		)
		.then((answer) => {
			if (answer === YES_MSG) {
				BookmarkManager.instance
					.removeCategory(dataItem);
			}
		});
}