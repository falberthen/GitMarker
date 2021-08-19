import {
	IsInt,
	Min,
	MinLength,
 } from 'class-validator';
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

	@MinLength(7)
	url: Uri;

	@IsInt()
	@Min(0)
	stargazersCount!: number;

	@IsInt()
	forks!: number;

	public constructor(id: string, name: string,  url: Uri) {
		this.id = id;
		this.name = name;
		this.url = url;
	}
}