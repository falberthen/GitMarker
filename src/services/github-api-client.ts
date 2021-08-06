import axios from "axios";
import { GithubRepository } from "../models/github-repository";
import * as vscode from 'vscode';

export class GitHubApiClient {

	static async search(term: string, accessToken: string): Promise<GithubRepository[]> {
		
		var repos: GithubRepository[] = [];
		var url = `/search/repositories?q=${term}&access_token=${accessToken}`;
		
		const apiClient = axios.create({
			responseType: 'json',
			baseURL: 'https://api.github.com',
			headers: {
			  'content-Type': 'application/json',			  
			}
		 });
	
		 try {
			await apiClient.get(url)
			.then((response) => {			
				repos = response.data.items.map((val: any) => ({
					id: val.id,
					name: val.name,
					fullName: val.fullName,
					description: val.description,
					url: val.html_url				
				} as GithubRepository));		
						
				vscode.window.showInformationMessage(repos.length + ' repositories found.');
				return repos;
			});		
		} 
		catch (err) {	
			vscode.window.showErrorMessage('Error fetching data...');	
		}
	
		return repos;
	}
}
