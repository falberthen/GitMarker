import 'reflect-metadata';
import TYPES from './commands/base/types';
import BookmarkManager from './services/bookmark-manager';
import { Container } from 'inversify';
import { CreateCategory } from './commands/create-category';
import { CommandManager } from './services/command-manager';
import { RemoveCategory } from './commands/remove-category';
import { RenameCategory } from './commands/rename-category';
import { SearchRepositories } from './commands/search-repositories';
import { SyncRepository } from './commands/sync-repository';
import { CloneRepository } from './commands/clone-repository';
import { RemoveRepository } from './commands/remove-repository';
import { SetAccessToken } from './commands/setup-pat';
import { ExportBookmarks } from './commands/export-bookmarks';
import { ImportBookmarks } from './commands/import-bookmarks';
import { ClearAllCategories } from './commands/clear-all-categories';
import { HowToCreatePat } from './commands/how-to-create-pat';
import { Command } from './commands/base/command';
import { TreeViewManager } from './services/tree-view-manager';
import { PersonalAccessTokenManager } from './services/pat-manager';
import { DataStorageManager } from './services/data-storage-manager';
import { DateTimeHelper } from './utils/datetime-helper';
import { GitHubApiClient } from './services/github-api-client';
import { ClearPAT } from './commands/clear-pat';
import { SearchResultManager } from './services/search-result-manager';
import { PickCachedResults } from './commands/pick-cached-results';
import { AutoSyncRepositories } from './commands/auto-sync-repositories';

const container = new Container();

// Commands
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
container.bind<Command>(TYPES.command).to(ClearAllCategories);
container.bind<Command>(TYPES.command).to(ClearPAT);
container.bind<Command>(TYPES.command).to(HowToCreatePat);
container.bind<Command>(TYPES.command).to(PickCachedResults);
container.bind<Command>(TYPES.command).to(AutoSyncRepositories);

// Services
container.bind<CommandManager>(TYPES.commandManager).to(CommandManager);
container.bind<TreeViewManager>(TYPES.treeViewManager).to(TreeViewManager);
container.bind<PersonalAccessTokenManager>(TYPES.patManager).to(PersonalAccessTokenManager);
container.bind<DataStorageManager>(TYPES.dataStorageManager).to(DataStorageManager);
container.bind<DateTimeHelper>(TYPES.dateTimeHelper).to(DateTimeHelper);
container.bind<GitHubApiClient>(TYPES.gitHubApiClient).to(GitHubApiClient);
container.bind<BookmarkManager>(TYPES.bookmarkManager).to(BookmarkManager).inSingletonScope();
container.bind<SearchResultManager>(TYPES.searchResultManager).to(SearchResultManager).inSingletonScope();

export default container;