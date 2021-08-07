import { DateTime } from "luxon";
import { Uri } from "vscode";

export interface GithubRepository {
	id: string; 
	name: string;
	fullName: string;
	stargazersCount: number;
	language: string;
	description: string;
	url: Uri;
	forks: number;
	license: any;
	lastSyncDate: DateTime;
}