import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { 
	PAT_ERR_INVALID, 
	TYPE_ACCESS_TOKEN_PLACEHOLDER,
	ACCESS_TOKEN_SET_SUCCESS
} from '../consts/constants-messages';
import { SETUP_PAT } from '../consts/commands';
import { Command } from './base/command';
import { PersonalAccessTokenService } from '../services/pat-service';

@injectable()
export class SetAccessToken implements Command {

	constructor
	(
		@inject(TYPES.patService) 
		private accessTokenService: PersonalAccessTokenService
	) {}

	get id() {
		return SETUP_PAT;
	}

	async execute() {
		await vscode.window.showInputBox({
			value: '',
			placeHolder: TYPE_ACCESS_TOKEN_PLACEHOLDER,
		}).then(async token => {
			let trimmedToken = token?.trim();
			if(typeof trimmedToken === 'undefined') { // no action
				return;
			}
			if(trimmedToken === '') {
				vscode.window.showErrorMessage(PAT_ERR_INVALID);
				return;	
			}

			await this.accessTokenService.storeToken(trimmedToken);
			vscode.window.showInformationMessage(ACCESS_TOKEN_SET_SUCCESS);
		});
	}
}