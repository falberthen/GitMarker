import * as vscode from 'vscode';
import { BookmarkService } from '../services/bookmark-service';
import { inject, injectable} from 'inversify';
import { GENERIC_QUESTION_REMOVING, 
	GENERIC_YES_ANSWER, GENERIC_NO_ANSWER } from '../consts/constants-messages';
import { TreeDataItem } from '../models/tree-data-item';
import { REMOVE_REPOSITORY } from '../consts/commands';
import { Command } from './base/command';
import TYPES from './base/types';

@injectable()
export class RemoveRepository implements Command {

	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService
	) {}
	
	get id() {
		return REMOVE_REPOSITORY;
	}

	async execute(dataItem: TreeDataItem) {
		vscode.window
		.showInformationMessage(
			`${GENERIC_QUESTION_REMOVING} ${dataItem.label}?`,
			...[GENERIC_YES_ANSWER, GENERIC_NO_ANSWER]
		)
		.then((answer) => {
			if (answer === GENERIC_YES_ANSWER) {
				this.bookmarkService
					.removeRepository(dataItem);
			}
		});
	}
}