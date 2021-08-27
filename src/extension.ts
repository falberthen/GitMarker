import * as vscode from 'vscode';
import TYPES from './commands/base/types';
import container from './inversify.config';
import BookmarkManager from './services/bookmark-manager';
import { CommandsManager } from './services/command-manager';
import ContextManager from './services/context-manager';

export async function activate(context: vscode.ExtensionContext) {

	ContextManager.init(context);
	BookmarkManager.init();

	const cmdManager = container
		.get<CommandsManager>(TYPES.commandManager);

	cmdManager.registerCommands(context);
}

export function deactivate() {}