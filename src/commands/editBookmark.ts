import * as vscode from 'vscode';
import { TreeDataItem } from '../models/tree-data-item';
import { BookmarkManager } from '../services/bookmark-manager';

export async function editBookmark(manager: BookmarkManager, node: TreeDataItem) {

   let newName = await vscode.window.showInputBox({
      value: '',
      placeHolder:  `Type a new name for ${node.label}`,
   });

   if(typeof newName !== 'undefined' 
      && newName) {
      manager.editBookmark(node, newName);
   }
}