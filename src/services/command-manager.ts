import * as vscode from 'vscode';
import TYPES from '../commands/base/types';
import { multiInject, injectable } from 'inversify';
import { Command } from '../commands/base/command';

@injectable()
export class CommandsManager {
	constructor(
		@multiInject(TYPES.command) 
		private commands: Command[]
	) {}

	registerCommands(context: vscode.ExtensionContext) {
		for (const c of this.commands) {
			const cmd = vscode.commands.registerCommand(c.id, c.execute, c);
			context.subscriptions.push(cmd);
		}
	}
}