import * as vscode from 'vscode';
import TYPES from '../commands/base/types';
import { inject, injectable } from 'inversify';
import { CONTEXT_CATEGORY_COUNT, FAVORITE_REPOS_KEY, SET_CONTEXT } from '../consts/application';
import { GENERIC_ERR_ALREADY_EXISTS, CATEGORY_ERR_ALREADY_EXISTS } from '../consts/constants-messages';
import { CategoryModel } from '../models/category-model';
import { CategoriesRepositoriesModel } from '../models/categories-repositories-model';
import { GithubRepositoryModel } from '../models/github-repository-model';
import { TreeDataItem } from '../models/tree-data-item';
import { DataStorageService } from './data-storage-service';
import { TreeViewService } from './tree-view-service';

@injectable()
export class BookmarkService {
	categoryRepositories: CategoriesRepositoriesModel | undefined;

	constructor(
		@inject(TYPES.treeViewService) 
		private treeViewService: TreeViewService,
		@inject(TYPES.dataStorageService) 
		private dataStorageService: DataStorageService
	) {			
		this.loadStoredData();
	}

	addCategory(categoryName: string) {      
		const newCategory = new CategoryModel(categoryName);
		const existingCategory = this.categoryRepositories!.categories
			?.filter(n => n.name === categoryName)[0];

		if(existingCategory) {
			vscode.window
				.showInformationMessage(`${categoryName} ${CATEGORY_ERR_ALREADY_EXISTS}`);
			return;						
		}

		this.categoryRepositories!.categories
			?.push(newCategory);
		this.storeAndRefreshProvider();
	}

	bookmarkRepositories(categoryId: string, selectedRepositories: GithubRepositoryModel[]) { 
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
		const storedCategories = this.dataStorageService
			.getValue<CategoriesRepositoriesModel>(FAVORITE_REPOS_KEY);

		this.categoryRepositories = storedCategories 
			? storedCategories 
			: new CategoriesRepositoriesModel();

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, 
			this.categoryRepositories.categories);

		this.treeViewService
			.buildDataProviderItems(this.categoryRepositories);
	}
	
	renameCategory(dataItem: TreeDataItem, newName: string) {
		const category = this.categoryRepositories!.categories
			?.filter(c => c.id === dataItem.id)[0];

		const existingCategory = this.categoryRepositories!.categories
			?.filter(ec => ec.name === newName)[0];

		if(existingCategory && category?.name !== newName) {
			vscode.window
				.showErrorMessage(`${newName}${GENERIC_ERR_ALREADY_EXISTS}`);
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
			this.deleteMatchedRepository(dataItem.id!, repositoryId);
		});

		const index = this.categoryRepositories!.categories
			?.findIndex(c => c.id === dataItem.id);
		this.categoryRepositories!.categories
			?.splice(index, 1);
	
		this.storeAndRefreshProvider();
	}

	removeRepository(dataItem: TreeDataItem) {
		this.deleteMatchedRepository(dataItem.parentId, dataItem.customId);
		this.storeAndRefreshProvider();		
	}

	updateRepository(updatedRepository: GithubRepositoryModel) {
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
		this.dataStorageService
			.setValue<CategoriesRepositoriesModel>(FAVORITE_REPOS_KEY, 
				this.categoryRepositories!);

		// Refreshing all data items	
		this.treeViewService
			.buildDataProviderItems(this.categoryRepositories!);

		let categoryCount = this.categoryRepositories 
			? this.categoryRepositories!.categories.length
			: 0;

		vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, categoryCount);
	}

	private deleteMatchedRepository(categoryId: string, repositoryId: string) {
		// Removing it from the category
		const category = this.categoryRepositories!.categories
			?.filter(c => c.id === categoryId)[0];
		const index = category.repositories
			?.findIndex(r => r === repositoryId);
		category.repositories
			?.splice(index, 1);

		// Find other ocurrences
		const ocurrences: string[] = [];
		this.categoryRepositories!.categories.forEach(category => {
			const index = category.repositories
				?.findIndex(r => r === repositoryId);
			if(index >= 0) {
				ocurrences.push(repositoryId);
			}
		});

		// If no other ocurrences, hard remove it
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