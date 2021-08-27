import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { CLEAR_ALL } from '../consts/commands';
import { CLEAR_ALL_MSG, NO_MSG, YES_MSG } from '../consts/messages';
import { Command } from './base/command';
import { LocalStorageManager } from '../services/local-storage-manager';
import { FAVORITE_REPOS_KEY } from '../consts/application';

@injectable()
export class ClearAll implements Command {

	constructor
	(
		@inject(TYPES.localStorageManager) 
		private localStorageManager: LocalStorageManager
	) {}

	get id() {
		return CLEAR_ALL;
	}

	async execute() {
		vscode.window
			.showInformationMessage(
				CLEAR_ALL_MSG,
				...[YES_MSG, NO_MSG]
			)
			.then((answer) => {
				if (answer === 'Yes') {
					this.localStorageManager
						.clearValues(FAVORITE_REPOS_KEY);
						
					BookmarkManager.instance
						.loadStoredData();
				}
			});
    }
}