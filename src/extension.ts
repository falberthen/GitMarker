// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { clearAll } from './commands/clearAll';
import { createCategory } from './commands/createCategory';
import { deleteBookmark } from './commands/deleteBookmark';
import { editBookmark } from './commands/editBookmark';
import { searchRepositoriesCommand } from './commands/searchRepositories';
import { setAccessToken } from './commands/setAccessToken';
import { commands } from './consts/commands';
import { TreeDataItem } from './models/tree-data-item';
import { BookmarkManager } from './services/bookmark-manager';
import SecretManager from './services/secret-manager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	SecretManager.init(context);
	var bookmarkManager = new BookmarkManager(context);
	
	context.subscriptions.push(vscode.commands.registerCommand(commands.createCategory, async (args:any) => {
		await createCategory(bookmarkManager);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(commands.searchRepositories, async (node: TreeDataItem) => {
		await searchRepositoriesCommand(bookmarkManager, node);
	}));	

	context.subscriptions.push(vscode.commands.registerCommand(commands.setAccessToken, async (args:any) => {
		await setAccessToken(bookmarkManager);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand(commands.editBookmark,  (node: TreeDataItem) => {
		editBookmark(bookmarkManager, node);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(commands.deleteBookmark, (node: TreeDataItem) => {
		deleteBookmark(bookmarkManager, node);			
	}));

	context.subscriptions.push(vscode.commands.registerCommand(commands.clearAll, async (args:any) => {
		clearAll(bookmarkManager);
	}));	
}

// this method is called when your extension is deactivated
export function deactivate() {}