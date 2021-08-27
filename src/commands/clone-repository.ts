import * as vscode from 'vscode';
import { injectable} from 'inversify';
import { Command } from '../commands/base/command';
import { CLONE_REPOSITORY } from '../consts/commands';
import { TreeDataItem } from "../models/tree-data-item";
import { openFolderOptions } from '../utils/dialog-options';
import { 
   DEFAULT_PATH_CFG, GITMARKER_CONFIG, 
   TERMINAL_KEY, USE_DEFAULT_PATH_CFG 
} from '../consts/application';
import { 
   DO_YOU_WANT_CLONE_MSG, 
   GIT_CLONE_EXECUTED_MSG, 
   NO_MSG, YES_MSG 
} from '../consts/messages';

@injectable()
export class CloneRepository implements Command {
    
   get id() {
      return CLONE_REPOSITORY;
   }

   async execute(dataItem: TreeDataItem) {
		vscode.window
         .showInformationMessage(
            `${DO_YOU_WANT_CLONE_MSG}${dataItem.label}?`,
            ...[YES_MSG, NO_MSG]
         )
         .then((answer) => {
            if (answer === 'Yes') {
               this.pickClonePath(dataItem);
            }
         });   
   }

   pickClonePath(dataItem: TreeDataItem) {
      const config = vscode.workspace
         .getConfiguration(GITMARKER_CONFIG);

      const useDefaultPath = config
         .get(USE_DEFAULT_PATH_CFG);
      
      const defaultClonePath = config
         .get(DEFAULT_PATH_CFG) as string;   

      if(useDefaultPath && defaultClonePath) {
         this.executeTerminalCmd(dataItem, defaultClonePath);
         return;
      }
      
      vscode.window.showOpenDialog(openFolderOptions)
         .then(fileUri => {
            if(fileUri) {
               this.executeTerminalCmd(dataItem, fileUri[0].fsPath);
            }
      });
   }

   executeTerminalCmd(dataItem: TreeDataItem, path: string) {
      var terminal = vscode.window.terminals
         .find(e=>e.name === TERMINAL_KEY);

      if(!terminal) {
         terminal = vscode.window
            .createTerminal(TERMINAL_KEY);
      }

      terminal.sendText(`cls`);
      terminal.show();
      terminal.sendText(`git clone ${dataItem?.cloneUrl} ${path}\\${dataItem.label}`);
      vscode.window.showInformationMessage(`${GIT_CLONE_EXECUTED_MSG}${dataItem.label}`);
   }
}