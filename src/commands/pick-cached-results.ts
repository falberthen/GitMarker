import TYPES from './base/types';
import { inject, injectable} from 'inversify';
import { PICK_CACHED_RESULTS } from '../consts/commands';
import { Command } from './base/command';
import { SearchResultManager } from '../services/search-result-manager';

@injectable()
export class PickCachedResults implements Command {

	constructor
	(
		@inject(TYPES.searchResultManager)
		private searchResultManager: SearchResultManager,		
	) {}

	get id() {
		return PICK_CACHED_RESULTS;
	}

	async execute() {
		const page = 1;
		await this.searchResultManager.pickRepository(page);
	}
}