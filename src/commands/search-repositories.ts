import * as vscode from 'vscode';
import TYPES from './base/types';
import { inject, injectable } from 'inversify';
import { 
	RESULTS_FOR_TERM,REPOSITORY_ERR_NOT_FOUND, 
	TYPE_SEARCH_TERM_PLACEHOLDER, RESULTS_SHOW_RESULTS_FOUND 
} from '../consts/messages';
import { PICK_CACHED_RESULTS, SEARCH_REPOSITORIES } from '../consts/commands';
import { GitHubApiClient } from '../services/github-api-client';
import { Command } from './base/command';
import { GITMARKER_CONFIG, SEARCH_RESULTS_NUMBER } from '../consts/application';
import { SearchResultManager } from '../services/search-result-manager';
import { StatusBarItem } from 'vscode';

@injectable()
export class SearchRepositories implements Command {
	private searchResultSBarItem: StatusBarItem | undefined;

	constructor
	(
		@inject(TYPES.searchResultManager)
		private searchResultManager: SearchResultManager,
		@inject(TYPES.gitHubApiClient)
		private githubApiClient: GitHubApiClient
	) {
	}

	get id() {
		return SEARCH_REPOSITORIES;
	}

	async execute() {
		let searchTerm = await vscode.window.showInputBox({
			value: '',
			placeHolder: TYPE_SEARCH_TERM_PLACEHOLDER,
		});

		let trimmedSearchTerm = searchTerm?.trim();
		if(typeof trimmedSearchTerm !== 'undefined' && trimmedSearchTerm) {
			trimmedSearchTerm = trimmedSearchTerm.toLowerCase();
			this.setStatusBarMessage(`Searching for ${trimmedSearchTerm}...`);

			const page = 1;
			const resultsPerPage = vscode.workspace
				.getConfiguration(GITMARKER_CONFIG)
				.get<number>(SEARCH_RESULTS_NUMBER);

			// first search by term
			const searchResult = await this.githubApiClient
				.search(trimmedSearchTerm, resultsPerPage!, 1);			
			this.setStatusBarMessage('');

			if(searchResult.repositories.length === 0) {
				vscode.window.showInformationMessage(`${REPOSITORY_ERR_NOT_FOUND} '${trimmedSearchTerm}'`);
				return;
			}

			this.setStatusBarItem(`${RESULTS_FOR_TERM} '${trimmedSearchTerm}'`);
			this.searchResultManager.setSearchResults(trimmedSearchTerm, searchResult);
			await this.searchResultManager.pickRepository(page);					
		}		
	}

	private setStatusBarMessage(message: string) {
		vscode.window.setStatusBarMessage(message);
	}

	private setStatusBarItem(message: string, ){
		if(!this.searchResultSBarItem) {
			this.searchResultSBarItem = vscode.window
				.createStatusBarItem(vscode.StatusBarAlignment.Right);
			this.searchResultSBarItem.show();
		}

		this.searchResultSBarItem.text = message;
		this.searchResultSBarItem.tooltip = `${RESULTS_SHOW_RESULTS_FOUND} ${message}`;
		this.searchResultSBarItem.command = PICK_CACHED_RESULTS;
	}
}