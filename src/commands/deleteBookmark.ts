import * as vscode from 'vscode';
import { TreeDataItem } from '../models/tree-data-item';
import { BookmarkManager } from '../services/bookmark-manager';

export async function deleteBookmark(manager: BookmarkManager, node: TreeDataItem) {
   vscode.window
      .showInformationMessage(
         "Are you sure you want to delete it?",
         ...["Yes", "No"]
      )
      .then((answer) => {
         if (answer === "Yes") {
            manager.removeBookmark(node);
         }
      });
}