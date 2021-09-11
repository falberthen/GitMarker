import * as vscode from 'vscode';
import { inject, injectable } from 'inversify';
import TYPES from '../commands/base/types';
import { CONTEXT_CATEGORY_COUNT, FAVORITE_REPOS_KEY, SET_CONTEXT } from '../consts/application';
import { ALREADY_EXISTS_MSG, CATEGORY_ALREADY_EXISTS_MSG } from '../consts/messages';
import { Category } from '../models/category';
import { CategoriesRepositories } from '../models/categories-repositories';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { DataStorageManager } from './data-storage-manager';
import { TreeViewManager } from './tree-view-manager';

@injectable()
export default class BookmarkManager {
	categoryRepositories: CategoriesRepositories | undefined;

	constructor(
		@inject(TYPES.treeViewManager) 
		private treeViewManager: TreeViewManager,
		@inject(TYPES.dataStorageManager) 
		private dataStorageManager: DataStorageManager
	) {			
		this.loadStoredData();
	}

	addCategory(categoryName: string) {      
		const newCategory = new Category(categoryName);
		const existingCategory = this.categoryRepositories!.categories
			?.filter(n => n.name === categoryName)[0];

		if(existingCategory) {
			vscode.window
				.showInformationMessage(`${categoryName} ${CATEGORY_ALREADY_EXISTS_MSG}`);
			return;						
		}

		this.categoryRepositories!.categories
			?.push(newCategory);
		this.storeAndRefreshProvider();
	}

	bookmarkRepositories(categoryId: string, selectedRepositories: GithubRepository[]) { 
		const category = this.categoryRepositories!.categories
			?.filter(obj => obj.id === categoryId)[0];

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

	loadStoredData() {
		const storedCategories = this.dataStorageManager
			.getValue<CategoriesRepositories>(FAVORITE_REPOS_KEY);

		this.categoryRepositories = storedCategories 
			? storedCategories 
			: new CategoriesRepositories();

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, 
			this.categoryRepositories.categories);

		this.treeViewManager
			.buildDataProviderItems(this.categoryRepositories);
	}
	
	renameCategory(dataItem: TreeDataItem, newName: string) {
		const category = this.categoryRepositories!.categories
			?.filter(c => c.id === dataItem.id)[0];

		const existingCategory = this.categoryRepositories!.categories
			?.filter(ec => ec.name === newName)[0];

		if(existingCategory && category?.name !== newName) {
			vscode.window
				.showErrorMessage(`${newName}${ALREADY_EXISTS_MSG}`);
			return;
		}
			
		category.name = newName;
		this.storeAndRefreshProvider();		
	}

	removeCategory(dataItem: TreeDataItem) {
		const category = this.categoryRepositories!.categories
			?.filter(category => category.id === dataItem.id)[0];

		if(!category) {
			return;
		}

		// Removing repositories from category
		category.repositories.forEach(repositoryId => {
			this.checkDeleteRepository(dataItem.id!, repositoryId);
		});

		const index = this.categoryRepositories!.categories
			?.findIndex(c => c.id === dataItem.id);
		this.categoryRepositories!.categories
			?.splice(index, 1);
	
		this.storeAndRefreshProvider();
	}

	removeRepository(dataItem: TreeDataItem) {
		this.checkDeleteRepository(dataItem.parentId, dataItem.customId);
		this.storeAndRefreshProvider();		
	}

	updateRepository(updatedRepository: GithubRepository) {
		const existingRepository = this.categoryRepositories!.repositories
		?.filter(c => c.id === updatedRepository.id)[0];

		if(existingRepository) {
			let index = this.categoryRepositories!.repositories
				.indexOf(existingRepository);

			this.categoryRepositories!.repositories[index] = updatedRepository;
			this.storeAndRefreshProvider();
		}
	}

	storeAndRefreshProvider() {
		// Store updated values
		this.dataStorageManager
			.setValue<CategoriesRepositories>(FAVORITE_REPOS_KEY, 
				this.categoryRepositories!);

		// Refreshing all data items	
		this.treeViewManager
			.buildDataProviderItems(this.categoryRepositories!);

		var categoryCount = this.categoryRepositories 
			? this.categoryRepositories!.categories.length
			: 0;

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, categoryCount);
	}

	private checkDeleteRepository(categoryId: string, repositoryId: string) {
		// Removing it from the category
		const category = this.categoryRepositories!.categories
			?.filter(c => c.id === categoryId)[0];
		const index = category.repositories
			?.findIndex(r => r === repositoryId);
		category.repositories
			?.splice(index, 1);

		// If no other ocurrences, hard remove it
		const ocurrences: string[] = [];
		this.categoryRepositories!.categories.forEach(category => {
			const index = category.repositories
				?.findIndex(r => r === repositoryId);
			if(index >= 0) {
				ocurrences.push(repositoryId);
			}
		});

		if(ocurrences.length === 0) {
			const existingRepository = this.categoryRepositories!.repositories
				?.filter(c => c.id === repositoryId)[0];
			let index = this.categoryRepositories!.repositories
				.indexOf(existingRepository);
			this.categoryRepositories!.repositories
				?.splice(index, 1);
		}
	}
}