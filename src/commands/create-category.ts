import * as vscode from 'vscode';
import BookmarkManager from '../services/bookmark-manager';
import { injectable} from 'inversify';
import { CREATE_CATEGORY } from '../consts/commands';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import { Command } from './base/command';

@injectable()
export class CreateCategory implements Command {

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
                BookmarkManager.instance
                    .addCategory(name);
            }      
        });
    }
}