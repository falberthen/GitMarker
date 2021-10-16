import { DateTime } from "luxon";
import { Uri } from 'vscode';

export class GithubRepository {
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

	public constructor(id: string, name: string,  url: Uri) {
		this.id = id;
		this.name = name;
		this.url = url;	
		this.setCloneUrl();
	}

	public setCloneUrl() {
		if(this.url) {
			this.cloneUrl = `${this.url}.git`;
		}		
	}
}