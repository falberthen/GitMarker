
import * as vscode from 'vscode';
import { ExtensionContext, SecretStorage } from "vscode";
import { ACCESS_TOKEN_SECRET, GITHUB_TOKEN_DOC } from "../consts/application";
import { ACCESS_TOKEN_REQUIRED_MSG, CHECK_GITHUB_DOC_MSG, SET_TOKEN_NOW_MSG } from "../consts/messages";
import { SET_ACCESS_TOKEN } from "../consts/commands";

export default class SecretManager {
	private static _instance: SecretManager;

	constructor(private secretStorage: SecretStorage) {}

	static init(context: ExtensionContext): void {
		SecretManager._instance = new SecretManager(context.secrets);
	}

	static get instance(): SecretManager {
		return SecretManager._instance;
	}

	async storeSecret(key: string, value?: string): Promise<void> {
			if (key && value) {
            this.secretStorage.store(key, value);
        }
	}

	async getSecret(key: string): Promise<string | undefined> {
		return await this.secretStorage.get(key);
	}

	async getAccessToken():  Promise<string | undefined> {
		const accessToken = await this.getSecret(ACCESS_TOKEN_SECRET);

		if(!accessToken) { 
			const options = [] = [CHECK_GITHUB_DOC_MSG, SET_TOKEN_NOW_MSG];
			vscode.window.showInformationMessage(ACCESS_TOKEN_REQUIRED_MSG, ...options)
			.then(selection => {
				switch (selection) {
					case CHECK_GITHUB_DOC_MSG:
						vscode.env.openExternal(vscode.Uri.parse(GITHUB_TOKEN_DOC));
						break;
						case SET_TOKEN_NOW_MSG:
							vscode.commands.executeCommand(SET_ACCESS_TOKEN);
							break;
					default:
						break;
				}
			});				
		}

		return accessToken;
	}
}