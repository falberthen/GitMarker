import * as vscode from 'vscode';
import { DEFAULT_PATH_CFG, GITMARKER_CONFIG, 
      TERMINAL_KEY, USE_DEFAULT_PATH_CFG } from '../consts/application';
import { DO_YOU_WANT_CLONE_MSG, GIT_CLONE_EXECUTED,
    NO_MSG, YES_MSG } from '../consts/messages';
import { TreeDataItem } from "../models/tree-data-item";
import { openFolderOptions } from '../utils/dialog-options';

export async function cloneRepository(dataItem: TreeDataItem){
   vscode.window
		.showInformationMessage(
			`${DO_YOU_WANT_CLONE_MSG}${dataItem.label}?`,
			...[YES_MSG, NO_MSG]
		)
		.then((answer) => {
			if (answer === 'Yes') {
				pickClonePath(dataItem);
			}
		});   
}

function pickClonePath(dataItem: TreeDataItem) {
   const config = vscode.workspace
      .getConfiguration(GITMARKER_CONFIG);

   const useDefaultPath = config
      .get(USE_DEFAULT_PATH_CFG);
   
   const defaultClonePath = config
      .get(DEFAULT_PATH_CFG) as string;   

   if(useDefaultPath && defaultClonePath) {
      executeTerminalCmd(dataItem, defaultClonePath);
      return;
   }
   
   vscode.window.showOpenDialog(openFolderOptions)
      .then(fileUri => {
         if(fileUri) {
            executeTerminalCmd(dataItem, fileUri[0].fsPath);
         }
   });
}

function executeTerminalCmd(dataItem: TreeDataItem, path: string) {
   var terminal = vscode.window.terminals
      .find(e=>e.name === TERMINAL_KEY);

   if(!terminal) {
      terminal = vscode.window
         .createTerminal(TERMINAL_KEY);
   }

   terminal.sendText(`cls`);
   terminal.show();
   terminal.sendText(`git clone ${dataItem?.cloneUrl} ${path}\\${dataItem.label}`);
   vscode.window.showInformationMessage(`${GIT_CLONE_EXECUTED}${dataItem.label}`);
}