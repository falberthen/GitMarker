import * as vscode from 'vscode';

export const openDialogOptions: vscode.OpenDialogOptions = {
	canSelectMany: false,
	openLabel: 'Open',
	filters: {
		'Json files': ['json'],
	}
};