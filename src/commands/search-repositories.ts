import * as vscode from 'vscode';
import { inject, injectable } from 'inversify';
import TYPES from './base/types';
import BookmarkManager from '../services/bookmark-manager';
import { 
	CHOOSE_CATEGORY_MSG, 
	LAST_SEARCHED_TERM_MSG, 
	NO_REPOS_FOUND_MSG, TYPE_SEARCH_TERM_PLACEHOLDER 
} from '../consts/messages';
import { SEARCH_REPOSITORIES } from '../consts/commands';
import { GitHubApiClient, ISearchResult } from '../services/github-api-client';
import { Category } from '../models/category';
import { Command } from './base/command';
import { GITMARKER_CONFIG, SEARCH_RESULTS_NUMBER } from '../consts/application';
import { QuickInputButton, QuickInputButtons, Uri } from 'vscode';
import ContextManager from '../services/context-manager';
import { GithubRepository } from '../models/github-repository';

@injectable()
export class SearchRepositories implements Command {
	searchResults: ISearchResult[] = [];
	pageSelectedItems: PageSelectedItems[] = [];
	currentPage: number;
	totalPages: number;
	totalResults: number = 0;
	searchTerm: string | undefined;
	resultsPerPage: number | undefined;
	quickPick: vscode.QuickPick<RepoPickItem> | undefined;

	constructor
	(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
		@inject(TYPES.gitHubApiClient) 
		private githubApiClient: GitHubApiClient,
	) {
		this.totalPages = 0;
		this.currentPage = 0;
		this.searchTerm = '';		
	}

	get id() {
		return SEARCH_REPOSITORIES;
	}

	async execute() {
		this.searchTerm = await vscode.window.showInputBox({
			value: '',
			placeHolder: TYPE_SEARCH_TERM_PLACEHOLDER,
		});

		if(typeof this.searchTerm !== 'undefined' && this.searchTerm) {
			this.searchResults = [];
			this.pageSelectedItems = [];
			this.resultsPerPage = vscode.workspace
				.getConfiguration(GITMARKER_CONFIG)
				.get(SEARCH_RESULTS_NUMBER) as number;

			this.searchTerm = this.searchTerm.toLowerCase();
			this.setStatusBarMessage(`Searching for ${this.searchTerm}...`!);
			this.currentPage = 1;

			// First search by term
			const searchResult = await this.githubApiClient
				.search(this.searchTerm, this.resultsPerPage, this.currentPage);

			if(searchResult.repositories.length === 0) {
				this.setStatusBarMessage(`${NO_REPOS_FOUND_MSG} "${this.searchTerm}"`);
				return;
			}

			this.searchResults.push(searchResult);
			this.totalResults = this.searchResults[0].total;
			this.totalPages = Math.ceil(this.totalResults/this.resultsPerPage);

			await this.pickRepository(searchResult.repositories);
		}		
	}

	private async pickRepository(gitHubRepos: GithubRepository[]) {
		// Picking a repository from the result list
		this.setStatusBarMessage(`${LAST_SEARCHED_TERM_MSG} "${this.searchTerm}"`!);
		let repoPickItems = this.mapToPickItem(gitHubRepos);		
		this.quickPick = this.buildQuickPicker();
		this.quickPick.buttons = this.buildQuickPickButtons();
		this.quickPick.items = repoPickItems;
		this.quickPick.selectedItems = repoPickItems.filter(item => item.picked);
		this.quickPick.title = `${this.totalResults} results found for ${this.searchTerm}`,
		this.quickPick.show();

		// onDidTriggerButton event
		this.quickPick.onDidTriggerButton(async item => {
			await this.onDidTriggerButton(item, repoPickItems);			
		});
		
		// onDidChangeSelection event
		this.quickPick.onDidChangeSelection(async selectedItems => 
			this.onDidChangeSelection(selectedItems));

		// onDidAccept event
		this.quickPick.onDidAccept(async () => {
			this.onDidAccept();
		});		
	}

	private buildQuickPicker() {
		let quickPick = vscode.window.createQuickPick<RepoPickItem>();
		quickPick.canSelectMany = true;		
		quickPick.step = this.currentPage;
		quickPick.totalSteps = this.totalPages;		
		quickPick.matchOnDescription = true;
		quickPick.matchOnDetail = true;
		return quickPick;
	}

	private buildQuickPickButtons() : QuickInputButton[]{
		const context = ContextManager.instance.context;
		const nextButton = new PavigationButton(
			Direction.right,
			{
				dark: Uri.file(context.asAbsolutePath('resources/dark/forward.svg')),
				light: Uri.file(context.asAbsolutePath('resources/light/forward.svg')),			
			}, 
			'Next results');

		const backButton = new PavigationButton(
			Direction.left,
			{ dark: Uri.file(context.asAbsolutePath('resources/dark/back.svg')),
			  light: Uri.file(context.asAbsolutePath('resources/light/back.svg')),
			}, 
			'Previous results');

		if(this.totalPages > 1) {
			if(this.currentPage === this.totalPages) {
				return [backButton];
			}
			
			if(this.currentPage === 1) {
				return [nextButton];
			}
			else {
				return [backButton, nextButton];
			}
		}
		return [];
	}

	private buildWaitingButton() : QuickInputButton[] {
		const context = ContextManager.instance.context;
		const nextButtonInactive = new PavigationButton(
			Direction.waiting,
			{
				dark: Uri.file(context.asAbsolutePath('resources/dark/loading.svg')),
				light: Uri.file(context.asAbsolutePath('resources/light/loading.svg')),			
			}, 
			'loading...');

		return [nextButtonInactive];
	}

	private getPagePickedItems(repoItems: RepoPickItem[]) {
		const pageItems = this.pageSelectedItems
			.filter(e=>e.page === this.currentPage)[0];

		if(pageItems) {
			repoItems.forEach(element => {
				const selected = pageItems.items.filter(e=>e.id === element.id)[0];
				if(selected) {
					element.picked = true;
				}
			});
		}

		return repoItems.filter(item => item.picked);
	}

	private mapToPickItem(gitHubRepos: GithubRepository[]): RepoPickItem[] {
		const repoDetails = gitHubRepos.map(repoInfo =>  {
			const label = repoInfo.stargazersCount > 0 
			? `${repoInfo.name} ⭐${repoInfo.stargazersCount}` 
			: `${repoInfo.name}`;
			return {
				id: repoInfo.id,
				label: label,
				description: '',
				detail: repoInfo.description,
				picked: false,
				alwaysShow: true
			};
		});

		return repoDetails;
	}

	private async pickCategory(categories: Category[]) {
		const categoriesDetails = categories
		.map(categoryInfo =>  {
			return {
				id: categoryInfo.id,
				label: `📁 ${categoryInfo.name}`
			};
		});

		// picking a category from result list
		return await vscode.window.showQuickPick(categoriesDetails, {
			matchOnDescription: true,
			matchOnDetail: true,
			canPickMany: false,
			title: CHOOSE_CATEGORY_MSG,
		});
	}

	private setStatusBarMessage(message: string) {
		vscode.window.setStatusBarMessage(message,);
	}

	// QuickPick Events
	private async onDidChangeSelection(selectedItems: readonly RepoPickItem[]) {
		const selected = (selectedItems as RepoPickItem[]).map(a => a);
		const currentPageItems = this.pageSelectedItems
			.filter(e=>e.page === this.currentPage)[0];
		
		if(!currentPageItems){
			const itemsPage = new PageSelectedItems(this.currentPage, selected);
			this.pageSelectedItems.push(itemsPage);
			return;
		}
		
		currentPageItems.items = selected;
	}

	private async onDidTriggerButton(quickInputButton: vscode.QuickInputButton, repoPickItems: RepoPickItem[] ) {		
		const button = (quickInputButton as PavigationButton);

		// BACK BUTTON
		if (button.direction === Direction.left) {
			this.currentPage = this.quickPick!.step = --this.currentPage;
			const items = this.searchResults
				.filter(e=> e.page === this.currentPage)[0];		
			repoPickItems = this.mapToPickItem(items.repositories);
			this.quickPick!.buttons = this.buildQuickPickButtons();
		}

		// FORWARD BUTTON
		if(button.direction === Direction.right) { 
			this.currentPage = this.quickPick!.step = ++this.currentPage;		

			const items = this.searchResults
				.filter(e=> e.page === this.currentPage)[0];

			if(items) { // CACHED DATA
				repoPickItems = this.mapToPickItem(items.repositories);
				
			}
			else { // SEARCH NEW DATA
				this.quickPick!.busy = true;
				this.quickPick!.buttons = this.buildWaitingButton();
				
				const searchResult = await this.githubApiClient
					.search(this.searchTerm!, this.resultsPerPage!, this.currentPage);

				this.searchResults.push(searchResult);		
				repoPickItems = this.mapToPickItem(searchResult.repositories);
				this.quickPick!.busy = false;				
			}

			this.quickPick!.buttons = this.buildQuickPickButtons();
		}
		
		this.quickPick!.items = repoPickItems;
		this.quickPick!.selectedItems = this.getPagePickedItems(repoPickItems);		
	}

	private async onDidAccept() {
		const selectedRepositories: GithubRepository[] = [];
			const allCategories = this.bookmarkManager
				.categoryRepositories.categories;

			// getting GitHubRepositories from searchResults
			this.pageSelectedItems.forEach(pageItem => {
				const reposPage =  this.searchResults
					.filter(e=>e.page === pageItem.page)[0];

				const resultIds = pageItem.items.map(a => a.id);
				const selectedReposPerPage = reposPage.repositories
					.filter(repo => resultIds.includes(repo.id));

				// joining all repositories
				selectedRepositories.push
					.apply(selectedRepositories, selectedReposPerPage);
			});
			
			// No need for selecting a category
			if(allCategories.length === 1) {							
				return this.bookmarkManager
					.bookmarkRepositories(allCategories[0].id, selectedRepositories); 
			}

			// Selecting category
			await this.pickCategory(allCategories)
				.then(category => {
					return this.bookmarkManager
						.bookmarkRepositories(category?.id!, selectedRepositories);
				});
	}
}

// Support classes for Multi-Step picker
class RepoPickItem implements vscode.QuickPickItem {
	constructor(public id: string,
		public label: string, public picked: boolean ) { }
}

class PageSelectedItems {
	constructor(public page:number, public items: RepoPickItem[]) { }
}

class PavigationButton implements QuickInputButtons {
	constructor(public direction: Direction, public iconPath: { light: Uri; dark: Uri; }, 
		public tooltip: string,) { }
}

enum Direction {
  left,
  right,
	waiting
}