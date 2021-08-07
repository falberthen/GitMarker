import { TreeDataItem } from '../models/tree-data-item';
import { GitHubApiClient } from '../services/github-api-client';
import { getTimeDiff } from '../utils/datetime-helper';
import BookmarkManager from '../services/bookmark-manager';
import SecretManager from '../services/secret-manager';

export async function refreshRepository(dataItem: TreeDataItem) {
   const accessToken = await SecretManager.instance
      .getAccessToken();

   const repository = BookmarkManager.instance
      .getRepositoryModel(dataItem);
   
   if(repository && accessToken) {
      // request rate limit
      const oneMinuteDiff = getTimeDiff(repository.lastSyncDate).minutes > 1;
      if(oneMinuteDiff) {
         await new GitHubApiClient(accessToken)
         .getById(dataItem.customId)
         .then(repository => {
            BookmarkManager.instance
               .refreshRepository(repository, dataItem);
         });
      }      
   }   
}