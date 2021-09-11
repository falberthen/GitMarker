import * as vscode from 'vscode';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { inject, injectable} from 'inversify';
import { SYNC_REPOSITORY } from '../consts/commands';
import { TreeDataItem } from '../models/tree-data-item';
import { GitHubApiClient } from '../services/github-api-client';
import { Command } from './base/command';
import { REPOSITORY_NOT_AVAILABLE } from '../consts/messages';

@injectable()
export class SyncRepository implements Command {
	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
		@inject(TYPES.gitHubApiClient) 
		private gitHubApiClient: GitHubApiClient
	) {}
	
	get id() {
		return SYNC_REPOSITORY;
	}

	async execute(dataItem: TreeDataItem) {
		const repositoryId = dataItem.customId;
		if(repositoryId) {
			await this.gitHubApiClient
			.getById(repositoryId)
			.then(updatedRepository => {
				if(updatedRepository) {
					this.bookmarkManager
						.updateRepository(updatedRepository);
				}		
			})
			.catch(error => {
				if(error.response){
					this.showCustomResponseMessage(error.response);					
				}
			});
		}
	}

	private showCustomResponseMessage(response: any) {
		switch(response.status) {
			case 403: 
			this.gitHubApiClient.accessTokenManager!.showPatWarning();
			break;
			case 404:
				vscode.window.showErrorMessage(REPOSITORY_NOT_AVAILABLE);
			break;
			default: 
				vscode.window.showErrorMessage(response.data.message);			
		}
	}
}