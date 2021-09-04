import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { SYNC_REPOSITORY } from '../consts/commands';
import { REPO_SYNC_SUCCESS_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { GitHubApiClient } from '../services/github-api-client';
import { Command } from './base/command';

@injectable()
export class SyncRepository implements Command {
	constructor
	(
		@inject(TYPES.gitHubApiClient) 
		private githubApiClient: GitHubApiClient
	) {}
	
	get id() {
		return SYNC_REPOSITORY;
	}

	async execute(dataItem: TreeDataItem) {
		const repositoryId = dataItem.customId;
		if(repositoryId) {
			await this.githubApiClient
			.getById(repositoryId)
			.then(updatedRepository => {
				if(updatedRepository) {
					BookmarkManager.instance
						.updateRepository(updatedRepository);						
					vscode.window
						.showInformationMessage(`${dataItem.label} ${REPO_SYNC_SUCCESS_MSG}`);
				}		
			});
		}
	}
}