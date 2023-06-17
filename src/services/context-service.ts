import * as vscode from 'vscode';

export class ContextService {
	private static _instance: ContextService;
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {	
		this.context = context;
	}

	static init(context: vscode.ExtensionContext): void {
		ContextService._instance = new ContextService(context);
	}

	static get instance(): ContextService {
		return ContextService._instance;
	}

	get secrets() {
		return this.context.secrets;
	}
}