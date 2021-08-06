import * as vscode from 'vscode';
import { storageKeys } from '../consts/storageKeys';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { LocalStorageService } from './local-storage-service';
import { TreeDataItemProvider } from './tree-data-item-provider';

export class BookmarkManager {

	nodes: TreeDataItem[] | undefined;
	context: vscode.ExtensionContext;
	localStorageSvc!: LocalStorageService;
	dataProvider: TreeDataItemProvider;
	treeView: any;

	constructor(context: vscode.ExtensionContext) {	
		this.context = context;
		this.localStorageSvc =  new LocalStorageService(context.workspaceState);
		this.dataProvider = new TreeDataItemProvider();
		this.treeView = vscode.window.createTreeView('gitmarkerView', {
			showCollapseAll: true,
			treeDataProvider: this.dataProvider,
			canSelectMany: true
		});

		this.loadBookmarks();
		this.treeView.onDidChangeSelection((e: { selection: TreeDataItem[]; }) => 
			this.click(e.selection));
	}

	addCategory(categoryName: string) {      
		let newCategory = new TreeDataItem(categoryName);
		this.nodes?.push(newCategory);
		this.storeAndRefresh();
	}

	addBookmark(category: TreeDataItem, selectedRepo: GithubRepository) { 
		var existingNode = category
			.children?.filter(n => n.id === selectedRepo.id)[0];

		if(!existingNode) {
			let newNode = new TreeDataItem(selectedRepo.name, undefined, category.id);
			newNode.url = selectedRepo.url;
			newNode.description = selectedRepo.description;
			newNode.tooltip = selectedRepo.description;
			
			if(category.children === undefined ) {
				category.children = [];
			}
				
			category.children.push(newNode);
			this.storeAndRefresh();
		}
	}

	click(selected: TreeDataItem[]) {
		selected.forEach(element => {
			// Opens repository url
			if(element.url) {
				vscode.env.openExternal(element.url);
			}
		});
	}

	editBookmark(treeItem: TreeDataItem, newName: string) {
		treeItem.label = newName;
		this.storeAndRefresh();
	}

	loadBookmarks() {      
		this.nodes = this.localStorageSvc
			.getValue<TreeDataItem[]>(storageKeys.favoritedRepos);

		if(!this.nodes) {
			this.nodes = [];
		}

		this.dataProvider.setTreeItems(this.nodes);
		this.dataProvider.refresh();
	}

	removeBookmark(node: TreeDataItem) {
		let category = this.nodes?.filter(obj => 
			obj.id === node.parentId)[0];

		if(category) {
			let index = category.children?.findIndex(d => d.id === node.id); //find index in your array
			category.children?.splice(index as number, 1);//remove element from array
		}

		this.storeAndRefresh();
	}

	storeAndRefresh() {
		if(this.nodes) {
			this.localStorageSvc
				.setValue<TreeDataItem[]>(storageKeys.favoritedRepos, this.nodes);

			this.dataProvider.setTreeItems(this.nodes);
			this.dataProvider.refresh();
		}	
	}
}