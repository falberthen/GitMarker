import * as vscode from 'vscode';
import { BookmarkManager } from '../services/bookmark-manager';

export async function createCategory(manager: BookmarkManager) {
   let categoryName = await vscode.window.showInputBox({
      value: '',
      placeHolder:  'Type a new name for the category',
   });

   if(typeof categoryName !== 'undefined' 
      && categoryName) {
      manager.addCategory(categoryName);
   }
}