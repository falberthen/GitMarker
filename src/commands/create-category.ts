import * as vscode from 'vscode';
import { BookmarkService } from '../services/bookmark-service';
import { inject, injectable} from 'inversify';
import { CREATE_CATEGORY } from '../consts/commands';
import { CATEGORY_ERR_NAME_REQUIRED, CATEGORY_NAME_PLACEHOLDER } from '../consts/constants-messages';
import { Command } from './base/command';
import TYPES from './base/types';

@injectable()
export class CreateCategory implements Command {

  constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkManager: BookmarkService,
	) {}

  get id() {
    return CREATE_CATEGORY;
  }

  async execute() {
    await vscode.window.showInputBox({
      value: '',
      placeHolder: CATEGORY_NAME_PLACEHOLDER,
    })
    .then(name => {
			let trimmedName = name?.trim();
			if(typeof name === 'undefined') { // no action
				return;
			}
			if(trimmedName === '') {
				vscode.window.showErrorMessage(CATEGORY_ERR_NAME_REQUIRED);
				return;	
			}
      
			this.bookmarkManager.addCategory(trimmedName!);
    });
  }
}