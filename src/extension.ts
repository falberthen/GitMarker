// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { clearAll } from './commands/clearAll';
import { createCategory } from './commands/createCategory';
import { removeCategory } from './commands/removeCategory';
import { renameCategory } from './commands/renameCategory';
import { removeRepository } from './commands/removeRepository';
import { searchRepositoriesCommand } from './commands/searchRepositories';
import { setAccessToken } from './commands/setAccessToken';
import { refreshRepository } from './commands/refreshRepository';
import { howToSetupToken } from './commands/howToSetupToken';
import { TreeDataItem } from './models/tree-data-item';
import SecretManager from './services/secret-manager';
import BookmarkManager from './services/bookmark-manager';
import { 
	CREATE_CATEGORY, REMOVE_CATEGORY, 
	RENAME_CATEGORY, SEARCH_REPOSITORIES, 
	SET_ACCESS_TOKEN, REMOVE_REPOSITORY,
	CLEAR_ALL, REFRESH_REPOSITORY, SET_ACCESS_TOKEN_HELP, EXPORT_BOOKMARKS, IMPORT_BOOKMARKS
} from './consts/commands';
import { exportBookmarks } from './commands/exportBookmarks';
import { importBookmarks } from './commands/importBookmarks';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Init singleton instances
	SecretManager.init(context);
	BookmarkManager.init(context);
	
	context.subscriptions.push(vscode.commands.registerCommand(CREATE_CATEGORY, async () => {
		await createCategory();
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand(RENAME_CATEGORY,  (categoryDataItem: TreeDataItem) => {
		renameCategory(categoryDataItem);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(REMOVE_CATEGORY, async (category: TreeDataItem) => {
		await removeCategory(category);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(SEARCH_REPOSITORIES, async (repository: TreeDataItem) => {
		await searchRepositoriesCommand(repository);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(REFRESH_REPOSITORY, async (repository: TreeDataItem) => {
		await refreshRepository(repository);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(REMOVE_REPOSITORY, async (repository: TreeDataItem) => {
		await removeRepository(repository);
	}));

	// Config commands
	context.subscriptions.push(vscode.commands.registerCommand(SET_ACCESS_TOKEN_HELP, async () => {
		howToSetupToken();
	}));

	context.subscriptions.push(vscode.commands.registerCommand(SET_ACCESS_TOKEN, async () => {
		await setAccessToken();
	}));

	context.subscriptions.push(vscode.commands.registerCommand(EXPORT_BOOKMARKS, async () => {
		await exportBookmarks(context);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(IMPORT_BOOKMARKS, async () => {
		await importBookmarks(context);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand(CLEAR_ALL, async () => {
		clearAll();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}

