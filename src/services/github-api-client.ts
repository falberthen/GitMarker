import * as vscode from 'vscode';
import axios, { AxiosInstance } from "axios";
import TYPES from '../commands/base/types';
import container from '../inversify.config';
import { GithubRepository } from "../models/github-repository";
import { ERROR_FETCHING_DATA_MSG } from "../consts/messages";
import { DateTimeHelper } from '../utils/datetime-helper';

export class GitHubApiClient {
	accessToken: string;
	apiClient: AxiosInstance;
	private dateTimeHelper: DateTimeHelper;

	public constructor(accessToken: string) {
		this.apiClient = axios.create({
			responseType: 'json',
			baseURL: 'https://api.github.com',
			headers: {
			  'content-Type': 'application/json',	
			  'authorization': `Bearer ${accessToken}`
			}
		});

		 this.accessToken = accessToken;
		 this.dateTimeHelper = container
			.get(TYPES.dateTimeHelper) as DateTimeHelper;
	}

	async search(term: string) {
		let repos: GithubRepository[] = [];

		if(this.accessToken) {
			const url = `/search/repositories?q=${term}&access_token=${this.accessToken}`;

			try {
				await this.apiClient.get(url)
				.then((response) => {			
					repos = response.data.items.map((val: any) => ({
						id: val.id,
						name: val.name,
						fullName: val.full_name,
						ownerName: val.owner?.login,
						description: val.description,
						url: val.html_url,
						stargazersCount: val.stargazers_count,
						language:val.language,
						forks: val.forks,
						license: val.license,
						lastSyncDate: this.dateTimeHelper.getDateTimeNow()
					}));											
				});		
			} 
			catch (err) {	
				vscode.window.showErrorMessage(`${ERROR_FETCHING_DATA_MSG}`);				
			}
		}

		return repos;
	}

	async getById(repositoryId: string) {
		let repo!: GithubRepository;

		if(this.accessToken){
			const url = `/repositories/${repositoryId}&access_token=${this.accessToken}`;

			try {
				await this.apiClient.get(url)
				.then((response) => {			
					const data = response.data;
					repo = new GithubRepository(data.id, data.name, data.html_url);
					repo.ownerName = data.owner?.login;
					repo.fullName = data.full_name;
					repo.description = data.description;
					repo.stargazersCount = data.stargazers_count;
					repo.language = data.language;
					repo.forks = data.forks;
					repo.license = data.license;
					repo.lastSyncDate = this.dateTimeHelper.getDateTimeNow();
				});
			} 
			catch (err) {	
				vscode.window.showErrorMessage(`${ERROR_FETCHING_DATA_MSG}`);
			}
		}		

		return repo;
	}
}