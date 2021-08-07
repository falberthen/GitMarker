import axios, { AxiosInstance } from "axios";
import * as vscode from 'vscode';
import { 
	LAST_SEARCHED_TERM_MSG, 
	NO_REPOS_FOUND_MSG } from './../consts/messages';
import { GithubRepository } from "../models/github-repository";
import { ERROR_FETCHING_DATA_MSG } from "../consts/messages";
import { getDateTimeNow } from "../utils/datetime-helper";

export class GitHubApiClient {
	accessToken: string;
	apiClient: AxiosInstance;

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
	}
	
	async search(term: string): Promise<GithubRepository[]> {
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
						description: val.description,
						url: val.html_url,
						stargazersCount: val.stargazers_count,
						language:val.language,
						forks: val.forks,
						license: val.license,
						lastSyncDate: getDateTimeNow()
					}));		
						
					if(repos.length === 0) {
						vscode.window.setStatusBarMessage(`${NO_REPOS_FOUND_MSG} ${term}.`);
					}
					else{
						vscode.window.setStatusBarMessage(`${LAST_SEARCHED_TERM_MSG} "${term}".`, );
					}

					return repos;
				});		
			} 
			catch (err) {	
				vscode.window.showErrorMessage(`${ERROR_FETCHING_DATA_MSG}`);				
			}
		}
		
		return repos;
	}

	async getById(repositoryId: string): Promise<GithubRepository> {
		let repo!: GithubRepository;

		if(this.accessToken){
			const url = `/repositories/${repositoryId}&access_token=${this.accessToken}`;
	
			try {
				await this.apiClient.get(url)
				.then((response) => {			
					repo = response.data.items.map((val: any) => ({
						id: val.id,
						name: val.name,
						fullName: val.full_name,
						description: val.description,
						url: val.html_url,
						stargazersCount: val.stargazers_count,
						language:val.language,
						forks: val.forks,
						license: val.license,
						lastSyncDate: getDateTimeNow()
					}));
				});
			} 
			catch (err) {	
				vscode.window.showErrorMessage(`${ERROR_FETCHING_DATA_MSG}`);
			}
		}		

		return repo;
	}
}
