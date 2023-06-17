import * as vscode from 'vscode';
import { inject, injectable} from 'inversify';
import { AUTO_SYNC_REPOSITORIES } from '../consts/commands';
import { Command } from './base/command';
import { ENABLE_AUTO_SYNC, GITMARKER_CONFIG } from '../consts/application';
import { DateTimeHelper } from '../utils/datetime-helper';
import { GitHubApiClient } from '../services/github-api-client';
import { GithubRepositoryModel } from '../models/github-repository-model';
import { BookmarkService } from '../services/bookmark-service';
import TYPES from './base/types';
import { AxioClientService } from '../services/axio-client-service';

@injectable()
export class AutoSyncRepositories implements Command {

	constructor(
		@inject(TYPES.gitHubApiClient) 
		private gitHubApiClient: GitHubApiClient,
		@inject(TYPES.dateTimeHelper) 
		private dateTimeHelper: DateTimeHelper,
		@inject(TYPES.bookmarkService) 
		private bookmarkService: BookmarkService,
		@inject(TYPES.axioClientService) 
			private axioClientService: AxioClientService
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
		const [, isAuthorized] = await this.axioClientService
			.buildAxiosClient();
		
		if(synchronize && isAuthorized) {
			// Request rate limit needs to be at least 1 minute outdated to request an update
			const minimumWaitSync = 1;
			const reposToSync = this.bookmarkService
				.categoryRepositories?.repositories.filter(r => 
					this.dateTimeHelper.getTimeMinutesDiff(r.lastSyncDate).minutes > minimumWaitSync);
			
			if(reposToSync!.length > 0) {
				await this.syncRepositories(reposToSync!);
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
					this.bookmarkService.updateRepository(repository);
				}
				else {
					// repository is no longer available on GitHub
					var inactiveRepository = task[1];
					inactiveRepository.isActive = false;
					this.bookmarkService.updateRepository(inactiveRepository);
				}
			}
		};

		callUpdateTasks();
	}
}