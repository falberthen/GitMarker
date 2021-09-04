import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { DELETE_PAT } from '../consts/commands';
import { CLEAR_PAT_MSG, NO_MSG, PAT_CLEARED_SUCCESS, YES_MSG } from '../consts/messages';
import { Command } from './base/command';
import { PersonalAccessTokenManager } from '../services/pat-manager';

@injectable()
export class ClearPAT implements Command {

	constructor
	(
		@inject(TYPES.patManager) 
		private accessTokenManager: PersonalAccessTokenManager
	) {}

	get id() {
		return DELETE_PAT;
	}

	async execute() {
		vscode.window
			.showInformationMessage(
				CLEAR_PAT_MSG,
				...[YES_MSG, NO_MSG]
			)
			.then((answer) => {
				if (answer === 'Yes') {
					this.accessTokenManager
						.deleteToken().then(result => {
							vscode.window.showInformationMessage(PAT_CLEARED_SUCCESS);
						});						
				}
			});
    }
}