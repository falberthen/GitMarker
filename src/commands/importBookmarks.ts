import * as vscode from 'vscode';
import * as fs from 'fs';
import { ERROR_IMPORTING_MSG } from '../consts/messages';
import { validate } from 'class-validator';
import { Category, } from '../models/category';
import { plainToClass } from 'class-transformer';
import { GithubRepository } from '../models/github-repository';
import { openDialogOptions } from '../utils/open-dialog-options';
import BookmarkManager from '../services/bookmark-manager';

export async function importBookmarks(context: vscode.ExtensionContext) { 
     
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
                        BookmarkManager.instance.categories = validCategories;
                        BookmarkManager.instance.setRefresh();
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