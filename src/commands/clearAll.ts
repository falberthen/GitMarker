import * as vscode from 'vscode';
import { CLEAR_ALL_MSG, NO_MSG, YES_MSG } from '../consts/messages';
import { LocalStorageService } from '../services/local-storage-service';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import BookmarkManager from '../services/bookmark-manager';

export async function clearAll() {
   vscode.window
      .showInformationMessage(
         CLEAR_ALL_MSG,
         ...[YES_MSG, NO_MSG]
      )
      .then((answer) => {
         if (answer === 'Yes') {
            const localStorageSvc = new LocalStorageService(BookmarkManager.instance.context.workspaceState);
            localStorageSvc.clearValues(FAVORITE_REPOS_KEY);
            BookmarkManager.instance
               .loadStoredData();
         }
      });
}