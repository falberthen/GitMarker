import * as vscode from 'vscode';
import { ACCESS_TOKEN_SET_MSG, TYPE_ACCESS_TOKEN_PLACEHOLDER } from './../consts/messages';
import { ACCESS_TOKEN_SECRET } from '../consts/application';
import SecretManager from '../services/secret-manager';

export async function setAccessToken() {   
	await vscode.window.showInputBox({
		value: '',
		placeHolder: TYPE_ACCESS_TOKEN_PLACEHOLDER,
	}).then(token => {
      if(typeof token !== 'undefined' && token) {
         SecretManager.instance.storeSecret(ACCESS_TOKEN_SECRET, token);
         vscode.window.showInformationMessage(ACCESS_TOKEN_SET_MSG);
      }
   });
}