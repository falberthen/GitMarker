import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { 
	ACCESS_TOKEN_SET_MSG, 
	TYPE_ACCESS_TOKEN_PLACEHOLDER 
} from '../consts/messages';
import { SETUP_PAT } from '../consts/commands';
import { Command } from './base/command';
import { PersonalAccessTokenManager } from '../services/pat-manager';

@injectable()
export class SetAccessToken implements Command {

	constructor
	(
		@inject(TYPES.patManager) 
		private accessTokenManager: PersonalAccessTokenManager
	) {}

	get id() {
		return SETUP_PAT;
	}

	async execute() {
		await vscode.window.showInputBox({
			value: '',
			placeHolder: TYPE_ACCESS_TOKEN_PLACEHOLDER,
		}).then(async token => {
			if(typeof token !== 'undefined' && token) {
				await this.accessTokenManager
					.storeToken(token);
				vscode.window.showInformationMessage(ACCESS_TOKEN_SET_MSG);
			}
		});
	}
}