import { DateTime } from 'luxon';
import * as vscode from 'vscode';

export const openDialogOptions: vscode.OpenDialogOptions = {
	canSelectMany: false,
	openLabel: 'Open',
	filters: {
		'json GitMark files': ['json'],
	}
};

export const saveDialogOptions: vscode.SaveDialogOptions = {
	defaultUri: vscode.Uri.file(`gitmarker_${DateTime.now().toFormat('yyyy-MM-dd')}.json`),
	saveLabel: 'Save',
	filters: {
		'json GitMark files': ['json'],
	}
};

export const openFolderOptions: vscode.OpenDialogOptions = {
	canSelectMany: false,
	openLabel: 'Select Path',
	canSelectFiles: false,
	canSelectFolders: true
};