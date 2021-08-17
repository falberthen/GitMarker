import * as vscode from 'vscode';
import * as fs from 'fs';
import { ERROR_IMPORTING_MSG } from '../consts/messages';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GithubRepository } from '../models/github-repository';
import { openDialogOptions } from '../utils/open-dialog-options';
import { CategoriesRepositories } from '../models/categories-repositories';
import BookmarkManager from '../services/bookmark-manager';

export async function importBookmarks() { 
   await vscode.window.showOpenDialog(openDialogOptions)
   .then(fileUri => {
      if (fileUri && fileUri[0]) {
         fs.readFile(fileUri[0].fsPath, 'utf8' , (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            validateImport(data);
          });
      }
  });
}

async function validateImport(data: string) {
   try {
      let validRepositories: GithubRepository[] = [];
      const parsedObject = JSON.parse(data);
      const categoriesRepositories = plainToClass(CategoriesRepositories, parsedObject);

      // Repository schema validation
      categoriesRepositories.repositories.forEach(parsedRepository => {
         const repository  = plainToClass(GithubRepository, parsedRepository);
         validate(repository)
         .then(errors => {
            if (errors.length === 0) {
               validRepositories.push(repository);
               categoriesRepositories.repositories = validRepositories;                        
            }
         }).finally(() => {
            BookmarkManager.instance.categoryRepositories = categoriesRepositories;
            BookmarkManager.instance.storeAndRefreshProvider();
         });
      });
   } catch (error) {
      vscode.window.showErrorMessage(ERROR_IMPORTING_MSG);
   }     
}