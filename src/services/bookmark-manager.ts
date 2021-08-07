import * as vscode from 'vscode';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { CATEGORY_ALREADY_EXISTS_MSG } from '../consts/messages';
import { Category } from '../models/category';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { LocalStorageService } from './local-storage-service';
import { TreeViewManager } from './tree-view-manager';

export default class BookmarkManager {
	context: vscode.ExtensionContext;
	localStorageSvc!: LocalStorageService;
	categories: Category[] = [];
	treeViewManager: TreeViewManager;

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
		this.treeViewManager = new TreeViewManager(context);
		this.loadStoredCategories();
	}

	addCategory(categoryName: string) {      
		const newCategory = new Category(categoryName);
		const existingCategory = this.categories
			?.filter(n => n.name === categoryName)[0];

		if(existingCategory) {
			vscode.window
				.showInformationMessage(`${categoryName} ${CATEGORY_ALREADY_EXISTS_MSG}`);
			return;						
		}

		this.categories?.push(newCategory);
		this.setRefresh();
	}

	bookmarkRepository(dataItem: TreeDataItem, selectedRepository: GithubRepository) { 
		const category = this.categories
			?.filter(obj => obj.name === dataItem.label)[0];

		const repository = category
			?.repositories
			.filter(obj => obj.id === selectedRepository.id)[0];

		if(!repository) {
			category.repositories
				.push(selectedRepository);
			this.setRefresh();
		}
	}

	getRepositoryModel(dataItem: TreeDataItem) : GithubRepository | undefined {
		let repository: GithubRepository | undefined;
		const category = this.categories
			?.filter(obj => obj.id === dataItem.parentId)[0];

		if(category) {
			repository = category.repositories
				.find(r => r.id === dataItem.customId);
		}

		return repository;
	}

	loadStoredCategories() {
		const storedCategories = this.localStorageSvc
			.getValue<Category[]>(FAVORITE_REPOS_KEY);

		this.categories = storedCategories 
			? storedCategories 
			: [];

		vscode.commands.executeCommand('setContext', 'categoryCount', 
			this.categories.length);
		this.treeViewManager
			.refreshDataProvider(this.categories);
	}
	
	renameCategory(dataItem: TreeDataItem, newName: string) {
		const category = this.categories
			?.filter(obj => obj.name === dataItem.label)[0];

		if(category) {
			const existingCategory = this.categories
			?.filter(n => n.name === newName)[0];

			if(existingCategory && category?.name !== newName) {
				vscode.window
					.showErrorMessage(`${newName} already exists.`);
				return;
			}
				
			category.name = newName;
			this.setRefresh();
		}
	}

	removeCategory(dataItem: TreeDataItem) {
		const category = this.categories
			?.filter(obj => obj.id === dataItem.id)[0];

		if(category) {
			const index = this.categories
				?.findIndex(d => d.id === dataItem.id);
			this.categories
				?.splice(index as number, 1);
		}

		this.setRefresh();
	}

	removeRepository(dataItem: TreeDataItem) {
		const category = this.categories
			?.filter(obj => obj.id === dataItem.parentId)[0];

		if(category) {
			const index = category.repositories
				?.findIndex(d => d.id === dataItem.customId);

			category.repositories
				?.splice(index as number, 1);
			this.setRefresh();
		}
	}

	refreshRepository(repository: GithubRepository, dataItem: TreeDataItem) {
		const existingCategory = this.categories
			?.filter(obj => obj.id === dataItem.parentId)[0];

		if(existingCategory) {
			var repoInCategory = existingCategory.repositories
				.find(r => r.id === repository.id);

			if(repoInCategory) {
				let index = existingCategory
					.repositories.indexOf(repoInCategory);

				existingCategory.repositories[index] = repository;
				this.setRefresh();
			}
		}
	}

	private setRefresh(){
		this.localStorageSvc
			.setValue<Category[]>(FAVORITE_REPOS_KEY, this.categories);
		this.treeViewManager
			.refreshDataProvider(this.categories);

		vscode.commands.executeCommand('setContext', 'categoryCount', 
			this.categories.length);
	}
}