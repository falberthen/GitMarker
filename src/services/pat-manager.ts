import * as vscode from 'vscode';
import ContextManager from './context-manager';
import { SecretStorage } from "vscode";
import { ACCESS_TOKEN_SECRET, GITHUB_TOKEN_DOC } from "../consts/application";
import { injectable } from 'inversify';
import { ACCESS_TOKEN_REQUIRED_MSG, CHECK_GITHUB_DOC_MSG, SET_TOKEN_NOW_MSG } from '../consts/messages';
import { SETUP_PAT } from '../consts/commands';

@injectable()
export class PersonalAccessTokenManager {
	secretStorage: SecretStorage;

	constructor(){
		this.secretStorage = ContextManager.instance
			.secrets;
	}

	async getToken():  Promise<string | undefined> {
		const accessToken = await this.secretStorage
			.get(ACCESS_TOKEN_SECRET);

		return accessToken;
	}

	async storeToken(value?: string): Promise<void> {
		if (value) {
			this.secretStorage
				.store(ACCESS_TOKEN_SECRET, value);
		}
	}

	async deleteToken(): Promise<void> {
			this.secretStorage
				.delete(ACCESS_TOKEN_SECRET);
	}

	async showPatWarning() {
		const pat = await this.getToken();
		if(!pat) { 
			const options = [] = [CHECK_GITHUB_DOC_MSG, SET_TOKEN_NOW_MSG];
			vscode.window.showInformationMessage(ACCESS_TOKEN_REQUIRED_MSG, ...options)
			.then(selection => {
				switch (selection) {
					case CHECK_GITHUB_DOC_MSG:
						vscode.env.openExternal(vscode.Uri.parse(GITHUB_TOKEN_DOC));
						break;
					case SET_TOKEN_NOW_MSG:
						vscode.commands.executeCommand(SETUP_PAT);
						break;
				}
			});				
		}
	}
}