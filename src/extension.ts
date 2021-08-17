import * as vscode from 'vscode';
import { clearAll } from './commands/clearAll';
import { createCategory } from './commands/createCategory';
import { removeCategory } from './commands/removeCategory';
import { renameCategory } from './commands/renameCategory';
import { removeRepository } from './commands/removeRepository';
import { searchRepositories } from './commands/searchRepositories';
import { setAccessToken } from './commands/setAccessToken';
import { syncRepository } from './commands/syncRepository';
import { howToSetupToken } from './commands/howToSetupToken';
import { exportBookmarks } from './commands/exportBookmarks';
import { importBookmarks } from './commands/importBookmarks';
import { TreeDataItem } from './models/tree-data-item';
import SecretManager from './services/secret-manager';
import BookmarkManager from './services/bookmark-manager';
import RepositorySyncManager from './services/repository-sync-manager';
import { 
	CREATE_CATEGORY, REMOVE_CATEGORY, RENAME_CATEGORY, SEARCH_REPOSITORIES, 
	SET_ACCESS_TOKEN, REMOVE_REPOSITORY, CLEAR_ALL, SYNC_REPOSITORY, 
	SET_ACCESS_TOKEN_HELP, EXPORT_BOOKMARKS, IMPORT_BOOKMARKS
} from './consts/commands';

export async function activate(context: vscode.ExtensionContext) {
	// Init singleton instances
	SecretManager.init(context);
	BookmarkManager.init(context);
	RepositorySyncManager.init();

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
		await searchRepositories(repository);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(SYNC_REPOSITORY, async (repository: TreeDataItem) => {
		await syncRepository(repository);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(REMOVE_REPOSITORY, async (repository: TreeDataItem) => {
		await removeRepository(repository);
	}));

	// Config commands
	context.subscriptions.push(vscode.commands.registerCommand(SET_ACCESS_TOKEN, async () => {
		await setAccessToken();
	}));

	context.subscriptions.push(vscode.commands.registerCommand(EXPORT_BOOKMARKS, async () => {
		await exportBookmarks(context);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(IMPORT_BOOKMARKS, async () => {
		await importBookmarks();
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand(CLEAR_ALL, async () => {
		clearAll();
	}));

	context.subscriptions.push(vscode.commands.registerCommand(SET_ACCESS_TOKEN_HELP, async () => {
		howToSetupToken();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}

