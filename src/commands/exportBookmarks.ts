import * as vscode from 'vscode';
import * as fs from 'fs';
import { LocalStorageService } from '../services/local-storage-service';
import { Category } from '../models/category';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { ERROR_EXPORTING_MSG } from '../consts/messages';

export async function exportBookmarks(context: vscode.ExtensionContext) {   
   const localStorageSvc = new LocalStorageService(context.workspaceState);

   await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file("gitmarker.json"),
   })
   .then(file => {
      if(file) {
         const storedCategories = localStorageSvc
			   .getValue<Category[]>(FAVORITE_REPOS_KEY);

         const serializedObj = JSON
            .stringify(storedCategories);

         try {
            new Promise((resolve, reject) => {
               fs.writeFile(file.fsPath, serializedObj, writeFileError => {
                  if (writeFileError) {
                     reject(writeFileError);
                     return;
                  }
              
                  resolve(file.fsPath);
               });            
            });
            
         } catch (error) {
            vscode.window.showErrorMessage(ERROR_EXPORTING_MSG);
         }         
      }
   });
}