import * as vscode from 'vscode';
import { inject, injectable } from 'inversify';
import TYPES from './base/types';
import { 
	RESULTS_FOR_TERM_MSG,
	NO_REPOS_FOUND_MSG, TYPE_SEARCH_TERM_PLACEHOLDER, CLICK_SHOW_RESULTS_FOUND 
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

		if(typeof searchTerm !== 'undefined' && searchTerm) {
			searchTerm = searchTerm.toLowerCase();
			this.setStatusBarMessage(`Searching for ${searchTerm}...`);

			const page = 1;
			const resultsPerPage = vscode.workspace
				.getConfiguration(GITMARKER_CONFIG)
				.get<number>(SEARCH_RESULTS_NUMBER);

			// First search by term
			const searchResult = await this.githubApiClient
				.search(searchTerm, resultsPerPage!, 1);
			this.setStatusBarMessage('');

			if(searchResult.repositories.length === 0) {
				vscode.window.showInformationMessage(`${NO_REPOS_FOUND_MSG} '${searchTerm}'`);
				return;
			}

			this.setStatusBarItem(`${RESULTS_FOR_TERM_MSG} '${searchTerm}'`);
			this.searchResultManager.setSearchResults(searchTerm, searchResult);
			await this.searchResultManager.pickRepository(page);					
		}		
	}

	private setStatusBarMessage(message: string) {
		vscode.window.setStatusBarMessage(message);
	}

	private setStatusBarItem(message: string){
		if(!this.searchResultSBarItem) {
			this.searchResultSBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
			this.searchResultSBarItem.show();
		}

		this.searchResultSBarItem.text = message;
		this.searchResultSBarItem.command = PICK_CACHED_RESULTS;
		this.searchResultSBarItem.tooltip = CLICK_SHOW_RESULTS_FOUND;
	}
}