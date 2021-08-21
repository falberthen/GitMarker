import * as vscode from 'vscode';
import { TreeDataItem } from '../models/tree-data-item';
import { getTimeDiff } from '../utils/datetime-helper';
import { GitHubApiClient } from './github-api-client';
import SecretManager from './secret-manager';
import BookmarkManager from './bookmark-manager';
import { REPO_SYNC_SUCCESS } from '../consts/messages';

export default class RepositorySyncManager {
	
	private static _instance: RepositorySyncManager;
	private accessToken: string | undefined;

	static init(): void {
		RepositorySyncManager._instance = new RepositorySyncManager();
	}
	
	static get instance(): RepositorySyncManager {
		return RepositorySyncManager._instance;
	}

	constructor() {
		SecretManager.instance
		.getAccessToken().then(token => {
			this.accessToken = token;
		});
	}

	async syncRepository(dataItem: TreeDataItem) {
		const minimumWaitSync = 1; 
		const repository = BookmarkManager.instance
			.getRepositoryModelByDataItem(dataItem);
		
		if(repository) {
			// Request rate limit
			// It needs to be at least 1 minute outdated
			const isOneMinuteDiff = getTimeDiff(repository.lastSyncDate)
				.minutes > minimumWaitSync;

			if(isOneMinuteDiff && this.accessToken !== undefined) {
				await new GitHubApiClient(this.accessToken)
				.getById(repository.id)
					.then(updatedRepository => {
						BookmarkManager.instance
							.updateRepository(updatedRepository);
						
						vscode.window.showInformationMessage(`${dataItem.label} ${REPO_SYNC_SUCCESS}`);
					});
			}
		}
	}
}