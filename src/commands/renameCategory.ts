import * as vscode from 'vscode';
import { TYPE_NAME_CATEGORY_MSG } from '../consts/messages';
import { TreeDataItem } from '../models/tree-data-item';
import BookmarkManager from '../services/bookmark-manager';

export async function renameCategory(dataItem: TreeDataItem) {
   let newName = await vscode.window.showInputBox({
      value: dataItem.label?.toString(),
      placeHolder:  `${TYPE_NAME_CATEGORY_MSG} ${dataItem.label}`,
   });

   if(typeof newName !== 'undefined' && newName) {
      BookmarkManager.instance
         .renameCategory(dataItem, newName);
   }
}