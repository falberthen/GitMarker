import * as vscode from 'vscode';

export default class ContextManager {
	private static _instance: ContextManager;
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {	
		this.context = context;
	}

	static init(context: vscode.ExtensionContext): void {
		ContextManager._instance = new ContextManager(context);
	}

	static get instance(): ContextManager {
		return ContextManager._instance;
	}

	get secrets() {
		return this.context.secrets;
	}
}