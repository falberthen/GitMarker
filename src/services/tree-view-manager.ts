import * as vscode from 'vscode';
import { GIT_MARKER_VIEW } from '../consts/application';
import { REFRESH_REPOSITORY } from '../consts/commands';
import { Category } from '../models/category';
import { GithubRepository } from '../models/github-repository';
import { TreeDataItem } from '../models/tree-data-item';
import { formatDate } from '../utils/datetime-helper';
import { TreeDataItemProvider } from './tree-data-item-provider';

export class TreeViewManager {
	context: vscode.ExtensionContext;
	dataProvider: TreeDataItemProvider;
	categories: Category[] | undefined;
	treeView: any;

	constructor(context: vscode.ExtensionContext) {	
		this.context = context;
		this.dataProvider = new TreeDataItemProvider();
		this.treeView = vscode.window.createTreeView(GIT_MARKER_VIEW, {
			showCollapseAll: true,
			treeDataProvider: this.dataProvider,
			canSelectMany: true
		});

		this.treeView.onDidChangeSelection((e: { selection: TreeDataItem[]; }) => 
			this.click(e.selection));
	}

	refreshDataProvider(categories?: Category[]) {
		if(categories) {			
			const dataItems: TreeDataItem[] = [];
			categories.forEach(category => {
				const categoryRepositories: TreeDataItem[] = [];
				category.repositories.forEach(repository => {
					let repositoryDataItem = new TreeDataItem(false, `${repository.name}`);
					repositoryDataItem.customId = repository.id;
					repositoryDataItem.parentId = category.id;
					repositoryDataItem.url = repository.url;					
					repositoryDataItem.tooltip = this.buildToolTip(repository);
					repositoryDataItem.description = repository.stargazersCount > 0 
						? `⭐${repository.stargazersCount}` 
						: '';
					
					categoryRepositories.push(repositoryDataItem);
				});

				const categoryDataItem = new TreeDataItem(true, category.name, categoryRepositories);
				categoryDataItem.id = category.id;
				dataItems.push(categoryDataItem);
			});

			this.dataProvider.setTreeItems(dataItems);
			this.dataProvider.refresh();
		}	
	}

	private buildToolTip(repository: GithubRepository): string {
		const newLine = '\n';
		const formattedDate = formatDate(repository.lastSyncDate);
		const lastUpdatedRow = `Last sync: ${formattedDate}${newLine}`;
		const description = repository.description !== null 
			? `${lastUpdatedRow}${newLine}${repository.description}${newLine}${newLine}`
			: '';
				
		// Tooltip rows
		let toolTipItems: string[] = [];
		toolTipItems.push(`⭐ Stars: ${repository.stargazersCount}`);
		toolTipItems.push(` 🍴  Forks: ${repository.forks}`);

		
		if(repository.language){
			toolTipItems.push(`🧬 Language: ${repository.language}`);
		}

		if(repository.license){
			toolTipItems.push(` 🕮 Licence: ${repository.license.name}`);
		}

		let toolTipStr = toolTipItems.join(newLine); 
		return `${description}${toolTipStr}`;
	}

   private click(selected: TreeDataItem[]) {
		selected.forEach(element => {
			if(element.url) {
				vscode.env.openExternal(element.url);
				vscode.commands.executeCommand(REFRESH_REPOSITORY, selected[0]);
			}
		});
	}
}