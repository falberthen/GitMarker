import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { PICK_CACHED_RESULTS } from '../consts/commands';
import { Command } from './base/command';
import { SearchResultService } from '../services/search-result-service';

@injectable()
export class PickCachedResults implements Command {

	constructor
	(
		@inject(TYPES.searchResultService)
		private searchResultManager: SearchResultService,		
	) {}

	get id() {
		return PICK_CACHED_RESULTS;
	}

	async execute() {
		const page = 1;
		await this.searchResultManager.pickRepository(page);
	}
}