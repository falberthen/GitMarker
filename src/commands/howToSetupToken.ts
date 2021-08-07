import * as vscode from 'vscode';
import { GITHUB_TOKEN_DOC } from '../consts/application';

export async function howToSetupToken() {
   vscode.env.openExternal(vscode.Uri.parse(GITHUB_TOKEN_DOC));
}