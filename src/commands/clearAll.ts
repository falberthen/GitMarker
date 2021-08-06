import * as vscode from 'vscode';
import { storageKeys } from '../consts/storageKeys';
import { BookmarkManager } from '../services/bookmark-manager';
import { LocalStorageService } from '../services/local-storage-service';

export async function clearAll(manager: BookmarkManager) {
   vscode.window
      .showInformationMessage(
         "Are you sure you want to clear all?",
         ...["Yes", "No"]
      )
      .then((answer) => {
         if (answer === "Yes") {
            const localStorageSvc = new LocalStorageService(manager.context.workspaceState);
            localStorageSvc.clearValues(storageKeys.favoritedRepos);
            manager.loadBookmarks();
         }
      });
}