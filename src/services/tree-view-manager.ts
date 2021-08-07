import * as vscode from 'vscode';
import { CONTEXT_CATEGORY_COUNT, GIT_MARKER_VIEW, SET_CONTEXT } from '../consts/application';
import { SYNC_REPOSITORY } from '../consts/commands';
import { TOOLTIP_FORKS, TOOLTIP_FORKS_LBL, TOOLTIP_LANGUAGE, 
			TOOLTIP_LASTSYNC, TOOLTIP_LICENSE, TOOLTIP_OWNED_BY, 
			TOOLTIP_STARGAZERS, TOOLTIP_STARGAZERS_LBL } from '../consts/messages';
import { CategoriesRepositories } from '../models/categories-repositories';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { formatDate } from '../utils/datetime-helper';
import { TreeDataItemProvider } from './tree-data-item-provider';

export class TreeViewManager {
	dataProvider: TreeDataItemProvider;
	treeView: any;

	private static _instance: TreeViewManager;

	static init(): void {
		TreeViewManager._instance = new TreeViewManager();
	}
	
	static get instance(): TreeViewManager {
		return TreeViewManager._instance;
	}

	constructor() {	
		this.dataProvider = new TreeDataItemProvider();
		this.treeView = vscode.window.createTreeView(GIT_MARKER_VIEW, {
			showCollapseAll: true,
			treeDataProvider: this.dataProvider,
			canSelectMany: true
		});

		this.treeView.onDidChangeSelection((e: { selection: TreeDataItem[]; }) => 
			this.click(e.selection));
	}

	buildDataProviderItems(categoriesRepositories: CategoriesRepositories) {
		if(categoriesRepositories) {			
			const dataItems: TreeDataItem[] = [];

			categoriesRepositories.categories.forEach(category => {
				const categoryRepositories: TreeDataItem[] = [];
				category.repositories.forEach(repositoryId => {
					const repository = categoriesRepositories
						.repositories.filter(r=>r.id === repositoryId)[0];
					
					// Building repository dataItem
					const repositoryDataItem = this
						.buildRepositoryDataItem(category.id, repository);					
					if(repositoryDataItem){
						categoryRepositories.push(repositoryDataItem);
					}										
				});

				// Building category dataItem
				const categoryDataItem = new TreeDataItem(true, category.name, categoryRepositories);
				categoryDataItem.id = category.id;
				dataItems.push(categoryDataItem);
			});
			
			vscode.commands.executeCommand(SET_CONTEXT, CONTEXT_CATEGORY_COUNT, 
				categoriesRepositories.categories.length);

			this.dataProvider.setTreeItems(dataItems);
			this.dataProvider.refresh();
		}
	}
	
	private buildRepositoryDataItem(categoryId: string, repository: GithubRepository) : TreeDataItem | undefined {
		let repositoryDataItem!: TreeDataItem;
		if(repository) {
			repositoryDataItem = new TreeDataItem(false, `${repository.name}`);
			repositoryDataItem.customId = repository.id;
			repositoryDataItem.parentId = categoryId;
			repositoryDataItem.url = repository.url;					
			repositoryDataItem.tooltip = this.buildToolTip(repository);
			repositoryDataItem.description = repository.stargazersCount > 0 
				? `⭐${repository.stargazersCount}` 
				: '';
		}

		return repositoryDataItem;
	}
	
	private buildToolTip(repository: GithubRepository): string {
		const newLine = '\n';

		// Tooltip rows
		let toolTipItems: string[] = [];
			
		if(repository.description){
			toolTipItems.push(`${repository.description}${newLine}`);
		}

		toolTipItems.push(`${TOOLTIP_OWNED_BY}${repository.ownerName}`);
		toolTipItems.push(`${TOOLTIP_STARGAZERS}${repository.stargazersCount}${TOOLTIP_STARGAZERS_LBL}`);
		toolTipItems.push(`${TOOLTIP_FORKS}${repository.forks}${TOOLTIP_FORKS_LBL}`);

		if(repository.language) { 
			toolTipItems.push(`${TOOLTIP_LANGUAGE}${repository.language}`);
		} 
			
		if(repository.license) { 
			toolTipItems.push(`${TOOLTIP_LICENSE}${repository.license.name}`);	
		}

		toolTipItems.push(`${newLine}`);
		toolTipItems.push(`${TOOLTIP_LASTSYNC}${formatDate(repository.lastSyncDate)}`);

		return toolTipItems.join(newLine); 
	}

   private click(selected: TreeDataItem[]) {
		selected.forEach(element => {
			if(element.url) {
				vscode.env.openExternal(element.url);
				vscode.commands.executeCommand(SYNC_REPOSITORY, selected[0]);
			}
		});
	}
}