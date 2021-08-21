import * as vscode from 'vscode';

export const openDialogOptions: vscode.OpenDialogOptions = {
	canSelectMany: false,
	openLabel: 'Open',
	filters: {
		'Json files': ['json'],
	}
};

export const saveDialogOptions: vscode.SaveDialogOptions = {
	defaultUri: vscode.Uri.file("gitmarker.json"),
	saveLabel: 'Save',
	filters: {
		'Json files': ['json'],
	}
};

export const openFolderOptions: vscode.OpenDialogOptions = {
	canSelectMany: false,
	openLabel: 'Select Path',
	canSelectFiles: false,
	canSelectFolders: true
};