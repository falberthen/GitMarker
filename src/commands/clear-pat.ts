import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { DELETE_PAT } from '../consts/commands';
import { PAT_CLEAR_QUESTION, PAT_CLEARED_SUCCESS,
				 GENERIC_YES_ANSWER, GENERIC_NO_ANSWER } from '../consts/constants-messages';
import { Command } from './base/command';
import { PersonalAccessTokenService } from '../services/pat-service';

@injectable()
export class ClearPAT implements Command {

	constructor
	(
		@inject(TYPES.patService) 
		private accessTokenService: PersonalAccessTokenService
	) {}

	get id() {
		return DELETE_PAT;
	}

	async execute() {
		vscode.window.showInformationMessage(
			PAT_CLEAR_QUESTION,
			...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
		)
		.then((answer) => {
			if (answer === GENERIC_YES_ANSWER) {
				this.accessTokenService.deleteToken()
				.then(() => {
					vscode.window.showInformationMessage(PAT_CLEARED_SUCCESS);
				});				
			}
		});
	}
}