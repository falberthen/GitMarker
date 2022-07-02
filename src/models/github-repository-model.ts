import { DateTime } from "luxon";
import { Uri } from 'vscode';

export class GithubRepositoryModel {
	id: string;
	name: string;
	fullName!: string;
	ownerName!: string;
	description!: string;
	language!: string;
	license!: any;
	lastSyncDate!: DateTime;
	cloneUrl: string | undefined;
	url: Uri;
	stargazersCount!: number;
	forks!: number;
	isActive:boolean;

	public constructor(id: string, name: string,  url: Uri, isActive: boolean = true) {
		this.id = id;
		this.name = name;
		this.url = url;	
		this.isActive = isActive;
		this.setCloneUrl();
	}

	public setCloneUrl() {
		if(this.url) {
			this.cloneUrl = `${this.url}.git`;
		}		
	}
}