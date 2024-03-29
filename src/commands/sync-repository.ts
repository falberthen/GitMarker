import * as vscode from 'vscode';
import TYPES from './base/types';
import { BookmarkService } from '../services/bookmark-service';
import { inject, injectable} from 'inversify';
import { SYNC_REPOSITORY } from '../consts/commands';
import { TreeDataItem } from '../models/tree-data-item';
import { GitHubApiClient } from '../services/github-api-client';
import { Command } from './base/command';
import { REPOSITORY_ERR_NOT_AVAILABLE, REPOSITORY_UPDATED } from '../consts/constants-messages';
import { GithubRepositoryModel } from '../models/github-repository-model';

@injectable()
export class SyncRepository implements Command {
	constructor
	(
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService,
		@inject(TYPES.gitHubApiClient) 
		private gitHubApiClient: GitHubApiClient,		
	) {}
	
	get id() {
		return SYNC_REPOSITORY;
	}

	async execute(dataItem: TreeDataItem) {		
		var updatedRepository = await this.gitHubApiClient
			.getById(dataItem.customId);
			
		if(!updatedRepository) {
			// repository is no longer available
			updatedRepository = new GithubRepositoryModel(
				dataItem.customId!, 
				dataItem.label!.toString(), 
				dataItem.url, 
				false);

			const errorMsg = REPOSITORY_ERR_NOT_AVAILABLE
				.replace('{repo-name}', updatedRepository.name);
			vscode.window.showErrorMessage(errorMsg);
		}
		else {
			const successMsg = REPOSITORY_UPDATED
				.replace('{repo-name}', updatedRepository.name);					
			vscode.window.showInformationMessage(successMsg);

			this.bookmarkService
				.updateRepository(updatedRepository);
		}
	}
}