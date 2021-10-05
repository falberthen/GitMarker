import * as vscode from 'vscode';
import { inject, injectable} from 'inversify';
import { AUTO_SYNC_REPOSITORIES } from '../consts/commands';
import { Command } from './base/command';
import { ENABLE_AUTO_SYNC, GITMARKER_CONFIG } from '../consts/application';
import { DateTimeHelper } from '../utils/datetime-helper';
import { GitHubApiClient } from '../services/github-api-client';
import { GithubRepository } from '../models/github-repository';
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
		const resultsPerPage = vscode.workspace
      .getConfiguration(GITMARKER_CONFIG)
      .get(ENABLE_AUTO_SYNC) as boolean;
		this.execute(resultsPerPage);
	}

	get id() {
		return AUTO_SYNC_REPOSITORIES;
	}

	async execute(synchronize: boolean) {		
		if(synchronize) {
			// Request rate limit - it needs to be at least 1 minute outdated
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

	async syncRepositories(reposToSync: GithubRepository[]) {
		const tasks: Promise<GithubRepository>[] = [];
			reposToSync.forEach(repository => {
				tasks.push(this.gitHubApiClient.getById(repository.id));
			});
			
			const callUpdateTasks = async () => {
				for (const task of tasks) {					
					const repo = await task;
					this.bookmarkManager.updateRepository(repo);
				}
			};
	
			callUpdateTasks();
	}
}