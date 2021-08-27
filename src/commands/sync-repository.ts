import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { SYNC_REPOSITORY } from '../consts/commands';
import { REPO_SYNC_SUCCESS_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import { GitHubApiClient } from '../services/github-api-client';
import { Command } from './base/command';
import { PersonalAccessTokenManager } from '../services/pat-manager';
import { DateTimeHelper } from '../utils/datetime-helper';

@injectable()
export class SyncRepository implements Command {
	accessToken: string | undefined;

	constructor
	(
		@inject(TYPES.accessTokenManager) 
		private accessTokenManager: PersonalAccessTokenManager,
		@inject(TYPES.dateTimeHelper) 
		private dateTimeHelper: DateTimeHelper
	){
		this.accessTokenManager.getToken().then(token => {
			this.accessToken = token;
		});
	}
	
	get id() {
		return SYNC_REPOSITORY;
	}

	async execute(dataItem: TreeDataItem) {
		const minimumWaitSync = 1; 
			const repository = BookmarkManager.instance
				.getRepositoryModelByDataItem(dataItem);
			
			if(repository) {
				// Request rate limit
				// It needs to be at least 1 minute outdated
				const isOneMinuteDiff = this.dateTimeHelper
					.getTimeDiff(repository.lastSyncDate)
					.minutes > minimumWaitSync;
	
				if(isOneMinuteDiff && this.accessToken !== undefined) {
					await new GitHubApiClient(this.accessToken)
					.getById(repository.id)
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
}