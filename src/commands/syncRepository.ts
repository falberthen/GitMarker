import { TreeDataItem } from '../models/tree-data-item';
import RepositorySyncManager from '../services/repository-sync-manager';

export async function syncRepository(repositoryDataItem: TreeDataItem) {
	await RepositorySyncManager.instance
		.syncRepository(repositoryDataItem);
}