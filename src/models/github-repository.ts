import { Uri } from "vscode";

export class GithubRepository {
	id!: string; 
	name!: string;
	description!: string;
	fullName!: string;
	url!: Uri;
}
 