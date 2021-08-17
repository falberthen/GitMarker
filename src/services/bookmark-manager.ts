import * as vscode from 'vscode';
import { CONTEXT_CATEGORY_COUNT, FAVORITE_REPOS_KEY, SET_CONTEXT } from '../consts/application';
import { ALREADY_EXISTS_MSG, CATEGORY_ALREADY_EXISTS_MSG } from '../consts/messages';
import { Category } from '../models/category';
import { CategoriesRepositories } from '../models/categories-repositories';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { LocalStorageService } from './local-storage-service';
import { TreeViewManager } from './tree-view-manager';
import { SYNC_REPOSITORY } from '../consts/commands';

export default class BookmarkManager {
	context: vscode.ExtensionContext;
	localStorageSvc!: LocalStorageService;
	categoryRepositories!: CategoriesRepositories;

	private static _instance: BookmarkManager;

	static init(context:  vscode.ExtensionContext): void {
		BookmarkManager._instance = new BookmarkManager(context);
	}
	
	static get instance(): BookmarkManager {
		return BookmarkManager._instance;
	}

	constructor(context: vscode.ExtensionContext) {	
		this.context = context;
		this.localStorageSvc = new LocalStorageService(context.workspaceState);
		this.loadStoredData();
	}

	addCategory(categoryName: string) {      
		const newCategory = new Category(categoryName);
		const existingCategory = this.categoryRepositories.categories
			?.filter(n => n.name === categoryName)[0];

		if(existingCategory) {
			vscode.window
				.showInformationMessage(`${categoryName} ${CATEGORY_ALREADY_EXISTS_MSG}`);
			return;						
		}

		this.categoryRepositories.categories
			?.push(newCategory);
		this.storeAndRefreshProvider();
	}

	bookmarkRepositories(categoryId: string, selectedRepositories: GithubRepository[]) { 
		const category = this.categoryRepositories.categories
			?.filter(obj => obj.id === categoryId)[0];

		if(category) {
			selectedRepositories.forEach(selectedRepository => {			
				// Searching in the global list
				let repository = this.categoryRepositories
					?.repositories
					.filter(r => r.id === selectedRepository.id)[0];
	
				if(!repository) {
					// Adding hard object to main list
					this.categoryRepositories
						?.repositories.push(selectedRepository);
				}
				else{
					// Updating existent
					this.updateRepository(selectedRepository);			
				}
	
				// Searching repo in the category
				const repositoryInCategory = category
					?.repositories
					.filter(repoId => repoId === selectedRepository.id)[0];
	
				if(!repositoryInCategory) {
					// Adding ref into category
					category.repositories.push(selectedRepository.id);
				}
			});

			this.storeAndRefreshProvider();
		}		
	}

	getRepositoryModelByDataItem(dataItem: TreeDataItem) : GithubRepository | undefined {
		const repository = this.categoryRepositories.repositories
			?.filter(obj => obj.id === dataItem.customId)[0];

		return repository;
	}

	loadStoredData() {
		const storedCategories = this.localStorageSvc
			.getValue<CategoriesRepositories>(FAVORITE_REPOS_KEY);

		this.categoryRepositories = storedCategories 
			? storedCategories 
			: new CategoriesRepositories();

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, 
			this.categoryRepositories.categories);

		TreeViewManager.instance
			.buildDataProviderItems(this.categoryRepositories);
	}
	
	renameCategory(dataItem: TreeDataItem, newName: string) {
		const category = this.categoryRepositories.categories
			?.filter(c => c.name === dataItem.label)[0];

		if(category) {
			const existingCategory = this.categoryRepositories.categories
				?.filter(ec => ec.name === newName)[0];

			if(existingCategory && category?.name !== newName) {
				vscode.window
					.showErrorMessage(`${newName}${ALREADY_EXISTS_MSG}`);
				return;
			}
				
			category.name = newName;
			this.storeAndRefreshProvider();
		}
	}

	removeCategory(dataItem: TreeDataItem) {
		const category = this.categoryRepositories.categories
			?.filter(category => category.id === dataItem.id)[0];

		if(category) {
			const index = this.categoryRepositories.categories
				?.findIndex(c => c.id === dataItem.id);
			this.categoryRepositories.categories
				?.splice(index as number, 1);
		}

		this.storeAndRefreshProvider();
	}

	removeRepository(dataItem: TreeDataItem) {
		const category = this.categoryRepositories.categories
			?.filter(c => c.id === dataItem.parentId)[0];

		if(category) {
			const index = category.repositories
				?.findIndex(r => r === dataItem.customId);

			category.repositories
				?.splice(index as number, 1);
			this.storeAndRefreshProvider();
		}
	}

	updateRepository(updatedRepository: GithubRepository) {
		const existingRepository = this.categoryRepositories.repositories
			?.filter(c => c.id === updatedRepository.id)[0];

		if(existingRepository) {
			let index = this.categoryRepositories.repositories
				.indexOf(existingRepository);

			this.categoryRepositories.repositories[index] = updatedRepository;
			this.storeAndRefreshProvider();
		}
	}

	storeAndRefreshProvider(){
		// Store updated values
		this.localStorageSvc
			.setValue<CategoriesRepositories>(FAVORITE_REPOS_KEY, 
				this.categoryRepositories);

		// Refreshing all data items	
		TreeViewManager.instance
			.buildDataProviderItems(this.categoryRepositories);

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, 
			this.categoryRepositories.categories.length);
	}
}