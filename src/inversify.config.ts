import 'reflect-metadata';
import TYPES from './commands/base/types';
import { Container } from 'inversify';
import { CreateCategory } from './commands/create-category';
import { CommandsManager } from './services/command-manager';
import { RemoveCategory } from './commands/remove-category';
import { RenameCategory } from './commands/rename-category';
import { SearchRepositories } from './commands/search-repositories';
import { SyncRepository } from './commands/sync-repository';
import { CloneRepository } from './commands/clone-repository';
import { RemoveRepository } from './commands/remove-repository';
import { SetAccessToken } from './commands/setup-pat';
import { ExportBookmarks } from './commands/export-bookmarks';
import { ImportBookmarks } from './commands/import-bookmarks';
import { ClearAll } from './commands/clear-all';
import { HowToCreatePat } from './commands/how-to-create-pat';
import { Command } from './commands/base/command';
import { TreeViewManager } from './services/tree-view-manager';
import { PersonalAccessTokenManager } from './services/pat-manager';
import { DataStorageManager } from './services/data-storage-manager';
import { DateTimeHelper } from './utils/datetime-helper';

const container = new Container();

container.bind<Command>(TYPES.command).to(CreateCategory);
container.bind<Command>(TYPES.command).to(RenameCategory);
container.bind<Command>(TYPES.command).to(RemoveCategory);
container.bind<Command>(TYPES.command).to(SearchRepositories);
container.bind<Command>(TYPES.command).to(SyncRepository);
container.bind<Command>(TYPES.command).to(CloneRepository);
container.bind<Command>(TYPES.command).to(RemoveRepository);
container.bind<Command>(TYPES.command).to(SetAccessToken);
container.bind<Command>(TYPES.command).to(ExportBookmarks);
container.bind<Command>(TYPES.command).to(ImportBookmarks);
container.bind<Command>(TYPES.command).to(ClearAll);
container.bind<Command>(TYPES.command).to(HowToCreatePat);

container.bind<CommandsManager>(TYPES.commandManager).to(CommandsManager);
container.bind<TreeViewManager>(TYPES.treeViewManager).to(TreeViewManager);
container.bind<PersonalAccessTokenManager>(TYPES.accessTokenManager).to(PersonalAccessTokenManager);
container.bind<DataStorageManager>(TYPES.dataStorageManager).to(DataStorageManager);
container.bind<DateTimeHelper>(TYPES.dateTimeHelper).to(DateTimeHelper);

export default container;