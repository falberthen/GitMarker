import { injectable } from 'inversify';
import * as vscode from 'vscode';
import { GITHUB_TOKEN_DOC } from '../consts/application';
import { HOW_TO_CREATE_PAT } from '../consts/commands';
import { Command } from './base/command';

@injectable()
export class HowToCreatePat implements Command {

	get id() {
		return HOW_TO_CREATE_PAT;
	}

	async execute() {
		vscode.env.openExternal(vscode.Uri.parse(GITHUB_TOKEN_DOC));
	}
}