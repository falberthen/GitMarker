import * as vscode from 'vscode';
import TYPES from './commands/base/types';
import container from './inversify.config';
import { CommandService } from './services/command-service';
import { ContextService } from './services/context-service';

export async function activate(context: vscode.ExtensionContext) {
	ContextService.init(context);
	const commandService = container
		.get<CommandService>(TYPES.commandService);

		commandService.registerCommands(context);
}

export function deactivate() {}