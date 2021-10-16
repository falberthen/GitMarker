import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import TYPES from '../commands/base/types';
import container from '../inversify.config';
import { GithubRepository } from "../models/github-repository";
import { DateTimeHelper } from '../utils/datetime-helper';
import { inject, injectable } from 'inversify';
import { PersonalAccessTokenManager } from './pat-manager';

export interface ISearchResult {
	total: number,
	page: number,
	repositories: GithubRepository[]
}

@injectable()
export class GitHubApiClient {
	private dateTimeHelper: DateTimeHelper;

	public constructor(
			@inject(TYPES.patManager) 
			public accessTokenManager: PersonalAccessTokenManager
		) {
				this.dateTimeHelper = container
					.get<DateTimeHelper>(TYPES.dateTimeHelper);
	}

	async search(term: string, perPageRecords: number, pageNumber: number) : Promise<ISearchResult> {
		const queryString = 'q=' + encodeURIComponent(`${term}`);
		const url = `/search/repositories?${queryString}+is:public&per_page=${perPageRecords}&page=${pageNumber}`;
		const client = await this.buildAxiosClient();
		let total = 0;

		const data = await client.get(url).then((response: any) => {
			total = response.data.total_count;	
			return response.data.items.map((val: any) => ({
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

		return { 
			page:pageNumber, 
			total: total,  
			repositories: data 
		};
	}

	async getById(repositoryId: string) {
		let repo!: GithubRepository;
		const url = `/repositories/${repositoryId}`;
		const client = await this.buildAxiosClient();

		await client.get(url).then((response: any) => {			
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

		return repo;
	}

	private async buildAxiosClient(): Promise<AxiosInstance> {
		const config : AxiosRequestConfig = {
			responseType: 'json',
			baseURL: 'https://api.github.com',
			headers: {
				'content-Type': 'application/json',	
			}
		};

		await this.accessTokenManager!.getToken()
			.then(accessToken => {
				if(accessToken) {
					config.headers!['authorization'] = `Bearer ${accessToken}`;
				}
			});
		
		return axios.create(config);
	}	
}