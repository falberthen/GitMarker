import * as vscode from 'vscode';
import { inject, injectable} from 'inversify';
import { AUTO_SYNC_REPOSITORIES } from '../consts/commands';
import { Command } from './base/command';
import { ENABLE_AUTO_SYNC, GITMARKER_CONFIG } from '../consts/application';
import { DateTimeHelper } from '../utils/datetime-helper';
import { GitHubApiClient } from '../services/github-api-client';
import { GithubRepositoryModel } from '../models/github-repository-model';
import BookmarkManager from '../services/bookmark-manager';
import TYPES from './base/types';

@injectable()
export class AutoSyncRepositories implements Command {

	constructor(
		@inject(TYPES.gitHubApiClient) 
		private gitHubApiClient: GitHubApiClient,
		@inject(TYPES.dateTimeHelper) 
		private dateTimeHelper: DateTimeHelper,
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager
	) {
		const autoSyncEnabled = vscode.workspace
      .getConfiguration(GITMARKER_CONFIG)
      .get<boolean>(ENABLE_AUTO_SYNC);
		this.execute(autoSyncEnabled);
	}

	get id() {
		return AUTO_SYNC_REPOSITORIES;
	}

	async execute(synchronize: boolean | undefined) {		
		if(synchronize) {
			// Request rate limit needs to be at least 1 minute outdated to request an update
			const minimumWaitSync = 1;
			const reposToSync = this.bookmarkManager
				.categoryRepositories!.repositories
				.filter(r => 
					this.dateTimeHelper.getTimeDiff(r.lastSyncDate)
					.minutes > minimumWaitSync
				);

			if(reposToSync.length > 0) {
				await this.syncRepositories(reposToSync);
			}
		}
	}

	async syncRepositories(reposToSync: GithubRepositoryModel[]) {
		const tasks: [Promise<GithubRepositoryModel>, GithubRepositoryModel][] = [];
		reposToSync.forEach(repository => {
			var getRepositoryTask = this.gitHubApiClient
				.getById(repository.id);
			tasks.push([getRepositoryTask, repository]);
		});
		
		const callUpdateTasks = async () => {
			for (const task of tasks) {				
				// executing promise	
				const repository = await task[0]
				.catch(error => {					
					if(error.response && error.response.data.block.reason !== 'unavailable') {
						vscode.window.showErrorMessage(error.response.data.message);				
					}
				});
				
				if(repository) { // update went well
					this.bookmarkManager.updateRepository(repository);
				}
				else {
					// repository is no longer available on GitHub
					var inactiveRepository = task[1];
					inactiveRepository.isActive = false;
					this.bookmarkManager.updateRepository(inactiveRepository);
				}
			}
		};

		callUpdateTasks();
	}
}