import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { CREATE_CATEGORY } from '../consts/commands';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import { Command } from './base/command';
import TYPES from './base/types';

@injectable()
export class CreateCategory implements Command {

    constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
	) {}

    get id() {
        return CREATE_CATEGORY;
    }

    async execute() {
        await vscode.window.showInputBox({
            value: '',
            placeHolder: TYPE_NAME_CATEGORY_MSG,
        })
        .then(name => {
            if(name) {
                this.bookmarkManager.addCategory(name);
            }
        });
    }
}