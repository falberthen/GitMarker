import * as vscode from 'vscode';
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import TYPES from '../commands/base/types';
import container from '../inversify.config';
import { GithubRepository } from "../models/github-repository";
import { DateTimeHelper } from '../utils/datetime-helper';
import { inject, injectable } from 'inversify';
import { PersonalAccessTokenManager } from './pat-manager';

@injectable()
export class GitHubApiClient {
	private dateTimeHelper: DateTimeHelper;

	public constructor(
			@inject(TYPES.patManager) 
			private accessTokenManager: PersonalAccessTokenManager
		) {
				this.dateTimeHelper = container
					.get<DateTimeHelper>(TYPES.dateTimeHelper);
	}

	async search(term: string, perPageRecords: number) {
		let repos: GithubRepository[] = [];
		const url = `/search/repositories?q=${term}+is:public&per_page=${perPageRecords}`;

		const client = await this.buildAxiosClient();
		await client.get(url).then((response) => {			
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
		})
		.catch(error => {
			var response = error.response;
			if(response){
				vscode.window.showErrorMessage(error.response.data.message);
				if(response.status === 403) {
					this.accessTokenManager!.showPatWarning();
				}
			}
		});
	
		return repos;
	}

	async getById(repositoryId: string) {
		let repo!: GithubRepository;
		const url = `/repositories/${repositoryId}`;

		const client = await this.buildAxiosClient();
		await client.get(url).then((response) => {			
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
		})
		.catch(error => {
			var response = error.response;
			if(response){
				vscode.window.showErrorMessage(error.response.data.message);
				if(response.status === 403) {
					this.accessTokenManager!.showPatWarning();
				}
			}
		});

		return repo;
	}

	private async buildAxiosClient(): Promise<AxiosInstance> {
		const config = {
			responseType: 'json',
			baseURL: 'https://api.github.com',
			headers: {
				'content-Type': 'application/json',	
			}
		} as AxiosRequestConfig;

		await this.accessTokenManager!
			.getToken().then(accessToken => {
				if(accessToken) {
					config.headers['authorization'] = `Bearer ${accessToken}`;
				}
			});
		
		return axios.create(config);
	}	
}