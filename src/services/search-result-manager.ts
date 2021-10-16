import * as vscode from 'vscode';
import { QuickInputButton, Uri } from "vscode";
import { inject, injectable } from 'inversify';
import { GithubRepository } from '../models/github-repository';
import { CHOOSE_CATEGORY_MSG } from '../consts/messages';
import { Category } from '../models/category';
import { GitHubApiClient, ISearchResult } from './github-api-client';
import { GITMARKER_CONFIG, SEARCH_RESULTS_NUMBER } from '../consts/application';
import { PageSelectedItems, PavigationButton, RepoPickItem } from '../models/repo-pick-item';
import { NavDirection } from '../consts/nav-direction';
import ContextManager from './context-manager';
import BookmarkManager from './bookmark-manager';
import TYPES from '../commands/base/types';

@injectable()
export class SearchResultManager {
  private searchResults: ISearchResult[] = [];
	private quickPick: vscode.QuickPick<RepoPickItem> | undefined;
	private pageSelectedItems: PageSelectedItems[] = [];
	private totalResults: number;
	private currentPage: number;
	private totalPages: number;
	private resultsPerPage: number | undefined;
	private searchTerm: string | undefined;

	constructor(
		@inject(TYPES.bookmarkManager) 
		private bookmarkManager: BookmarkManager,
		@inject(TYPES.gitHubApiClient) 
		private githubApiClient: GitHubApiClient
	) {
		this.totalResults = 0;
		this.totalPages = 0;
		this.currentPage = 0;
	}

  setSearchResults(searchTerm: string, searchResult: ISearchResult) {
    this.initializeValues();
    this.searchTerm = searchTerm;
    this.searchResults.push(searchResult);
    this.totalResults = this.searchResults[0].total;
    this.totalPages = Math.ceil(this.totalResults/this.resultsPerPage!);    
  }

  async pickRepository(page: number) {		
    this.currentPage = page;
    const pageResult = this.searchResults
			.filter(r => r.page === page)[0];

    if(pageResult) {
      // Picking a repository from the result list
      let repoPickItems = this.mapToPickItem(pageResult.repositories);
      this.initializePicker(repoPickItems);
    }
	}

  private initializeValues() {
    this.resultsPerPage = vscode.workspace
      .getConfiguration(GITMARKER_CONFIG)
      .get<number>(SEARCH_RESULTS_NUMBER);

    this.pageSelectedItems = [];
    this.searchResults = [];
    this.totalResults = 0;
    this.totalPages = 0;
		this.currentPage = 0;
  }

  private initializePicker(repoPickItems: RepoPickItem[]) {
    this.resultsPerPage = vscode.workspace
			.getConfiguration(GITMARKER_CONFIG)
			.get<number>(SEARCH_RESULTS_NUMBER);
        
    this.quickPick = this.buildQuickPicker();
    this.quickPick.buttons = this.buildQuickPickButtons();
    this.quickPick.items = repoPickItems;
    this.quickPick.title = `${this.totalResults} results found for ${this.searchTerm}`,
    this.quickPick.show();

    // onDidTriggerButton event
    this.quickPick.onDidTriggerButton(async button  => {
      await this.onDidTriggerButton(button as PavigationButton, repoPickItems);			
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

	private async pickCategory(categories: Category[]) {
		const categoriesDetails = categories
		.map(categoryInfo => {
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
			title: CHOOSE_CATEGORY_MSG
		});
	}

  private buildQuickPickButtons() : QuickInputButton[]{
    const context = ContextManager.instance.context;
    const nextButton = new PavigationButton(
      NavDirection.right,
      {
        dark: Uri.file(context.asAbsolutePath('resources/dark/forward.svg')),
        light: Uri.file(context.asAbsolutePath('resources/light/forward.svg')),			
      }, 
      'Next results'
    );

    const backButton = new PavigationButton(
      NavDirection.left,
      { dark: Uri.file(context.asAbsolutePath('resources/dark/back.svg')),
        light: Uri.file(context.asAbsolutePath('resources/light/back.svg')),
      }, 
      'Previous results'
    );

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
      NavDirection.waiting,
      {
        dark: Uri.file(context.asAbsolutePath('resources/dark/loading.svg')),
        light: Uri.file(context.asAbsolutePath('resources/light/loading.svg')),			
      }, 
      'loading...'
    );

    return [nextButtonInactive];
  }

  private getPagePickedItems(repoItems: RepoPickItem[]) {
    const pageItems = this.pageSelectedItems
      .filter(e => e.page === this.currentPage)[0];

    if(pageItems) {
      repoItems.forEach(element => { 
        const selected = pageItems
					.items.filter(i => i.id === element.id)[0];

        if(selected) {
          element.picked = true;
        }
      });
    }

    return repoItems.filter(item => item.picked);
  }

  private mapToPickItem(gitHubRepos: GithubRepository[]): RepoPickItem[] {
    const repoDetails = gitHubRepos.map(repoInfo => {
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

  // QuickPick Events
	private async onDidChangeSelection(selectedItems: readonly RepoPickItem[]) {
		const selected = selectedItems.map((i: RepoPickItem) => i);
		const currentPageItems = this.pageSelectedItems
			.filter(e => e.page === this.currentPage)[0];
		
		if(!currentPageItems){
			const itemsPage = new PageSelectedItems(this.currentPage, selected);
			this.pageSelectedItems.push(itemsPage);
			return;
		}
		
		currentPageItems.items = selected;
	}

	private async onDidTriggerButton(button: PavigationButton, repoPickItems: RepoPickItem[] ) {		

		// BACK BUTTON
		if (button.direction === NavDirection.left) {
			this.currentPage = this.quickPick!.step = --this.currentPage;
			const items = this.searchResults
				.filter(e=> e.page === this.currentPage)[0];		
			repoPickItems = this.mapToPickItem(items.repositories);
			this.quickPick!.buttons = this.buildQuickPickButtons();
		}

		// FORWARD BUTTON
		if(button.direction === NavDirection.right) { 
			this.currentPage = this.quickPick!.step = ++this.currentPage;		

			const items = this.searchResults
				.filter(e => e.page === this.currentPage)[0];

			if(items) { // IN-MEMORY DATA
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
			.categoryRepositories!.categories;

		// getting GitHubRepositories from searchResults
		this.pageSelectedItems.forEach(pageItem => {
			const reposPage =  this.searchResults
				.filter(e => e.page === pageItem.page)[0];

			const resultIds = pageItem.items.map(i => i.id);
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
		await this.pickCategory(allCategories).then(category => {
			if(category) {
				return this.bookmarkManager
				.bookmarkRepositories(category.id, selectedRepositories);
			}			
		});
	}
}