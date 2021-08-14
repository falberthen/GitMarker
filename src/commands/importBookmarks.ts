import * as vscode from 'vscode';
import * as fs from 'fs';
import { ERROR_IMPORTING_MSG } from '../consts/messages';
import { validate } from 'class-validator';
import { Category, } from '../models/category';
import { plainToClass } from 'class-transformer';
import { GithubRepository } from '../models/github-repository';
import { LocalStorageService } from '../services/local-storage-service';
import { FAVORITE_REPOS_KEY } from '../consts/application';
import { openDialogOptions } from '../utils/open-dialog-options';
import BookmarkManager from '../services/bookmark-manager';

export async function importBookmarks(context: vscode.ExtensionContext) {   

   const localStorageSvc = new LocalStorageService(context.workspaceState);

   await vscode.window.showOpenDialog(openDialogOptions)
   .then(fileUri => {
      if (fileUri && fileUri[0]) {
         fs.readFile(fileUri[0].fsPath, 'utf8' , (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            try {
               let validCategories: Category[] = [];
               const parsedObject = JSON.parse(data);
               const categories = plainToClass(Category, parsedObject);
               categories.forEach(category => {
                  category.repositories = plainToClass(GithubRepository, category.repositories);
                  validate(category)
                  .then(errors => {
                     if (errors.length === 0) {
                        validCategories.push(category);
                        localStorageSvc
                           .setValue(FAVORITE_REPOS_KEY, validCategories);
   
                        BookmarkManager.instance.treeViewManager
                           .refreshDataProvider(validCategories);
                     }
                  });
               });
            } catch (error) {
               vscode.window.showErrorMessage(ERROR_IMPORTING_MSG);
            }      
          });
      }
  });
}