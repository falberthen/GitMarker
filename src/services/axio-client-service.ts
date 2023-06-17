import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { inject, injectable } from "inversify";
import { PersonalAccessTokenService } from "./pat-service";
import TYPES from "../commands/base/types";

@injectable()
export class AxioClientService {

	public constructor(
		@inject(TYPES.patService) 
		public accessTokenService: PersonalAccessTokenService
	) {}

	public async buildAxiosClient(): Promise<[AxiosInstance, boolean]> {
		var axiosConfig = this.buildAxiosRequestConfig();
		var accessToken = await this.accessTokenService!.getToken();
		if(accessToken) {
			axiosConfig.headers!['authorization'] = `Bearer ${accessToken}`;

			try {
				// Token is valid, create and return the AxiosInstance
				await axios.get('/user', axiosConfig);
				return [axios.create(axiosConfig), true];
			}
			catch (error) {
				// Token is invalid or expired, don't use the Authorization header
				axiosConfig = this.buildAxiosRequestConfig();
			}					
		}
		
		return [axios.create(axiosConfig), false];
	}

	private buildAxiosRequestConfig(): AxiosRequestConfig {
		const config : AxiosRequestConfig = {
			responseType: 'json',
			baseURL: 'https://api.github.com',
			headers: {
				'Content-Type': 'application/json',	
			}
		};

		return config;
	}
}