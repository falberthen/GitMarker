import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { NavDirection } from '../consts/nav-direction';

// Support classes for Multi-Step picker
export class RepoPickItem implements vscode.QuickPickItem {
	constructor(public id: string,
		public label: string, public picked: boolean ) { }
}

export class PageSelectedItems {
	constructor(public page:number, public items: RepoPickItem[]) { }
}

export class PavigationButton implements vscode.QuickInputButton {
	constructor(public direction: NavDirection, public iconPath: { light: Uri; dark: Uri; }, 
		public tooltip: string,) { }
}
