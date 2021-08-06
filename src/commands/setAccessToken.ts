import * as vscode from 'vscode';
import { storageKeys } from '../consts/storageKeys';
import SecretManager from '../services/secret-manager';
import { BookmarkManager } from '../services/bookmark-manager';

export async function setAccessToken(bookmarkManager: BookmarkManager) {
   
	let accesstoken = await vscode.window.showInputBox({
		value: '',
		placeHolder: 'Type your GitHub access_token',
	});

   if(typeof accesstoken !== 'undefined' 
      && accesstoken) {

      if(!accesstoken) { 
         vscode.window.showErrorMessage('A GitHub access_token must be provided.');
         return;
      }      

      await SecretManager.instance
         .storeSecret(storageKeys.accessToken, accesstoken);
   }
}