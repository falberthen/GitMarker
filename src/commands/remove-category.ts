import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { injectable} from 'inversify';
import { SURE_REMOVING_MSG, YES_MSG } from '../consts/messages';
import { NO_MSG } from '../consts/messages';
import { REMOVE_CATEGORY } from '../consts/commands';
import { TreeDataItem } from '../models/tree-data-item';
import { Command } from './base/command';

@injectable()
export class RemoveCategory implements Command {

	get id() {
		return REMOVE_CATEGORY;
	}

	async execute(dataItem: TreeDataItem) {
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
}