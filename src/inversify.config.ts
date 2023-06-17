import 'reflect-metadata';
import TYPES from './commands/base/types';
import { Container } from 'inversify';
import { CreateCategory } from './commands/create-category';
import { CommandService } from './services/command-service';
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
import { TreeViewService } from './services/tree-view-service';
import { PersonalAccessTokenService } from './services/pat-service';
import { DataStorageService } from './services/data-storage-service';
import { DateTimeHelper } from './utils/datetime-helper';
import { GitHubApiClient } from './services/github-api-client';
import { ClearPAT } from './commands/clear-pat';
import { SearchResultService } from './services/search-result-service';
import { BookmarkService } from './services/bookmark-service';
import { PickCachedResults } from './commands/pick-cached-results';
import { AutoSyncRepositories } from './commands/auto-sync-repositories';
import { AxioClientService } from './services/axio-client-service';

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
container.bind<CommandService>(TYPES.commandService).to(CommandService);
container.bind<TreeViewService>(TYPES.treeViewService).to(TreeViewService);
container.bind<PersonalAccessTokenService>(TYPES.patService).to(PersonalAccessTokenService);
container.bind<DataStorageService>(TYPES.dataStorageService).to(DataStorageService);
container.bind<DateTimeHelper>(TYPES.dateTimeHelper).to(DateTimeHelper);
container.bind<GitHubApiClient>(TYPES.gitHubApiClient).to(GitHubApiClient);
container.bind<BookmarkService>(TYPES.bookmarkService).to(BookmarkService).inSingletonScope();
container.bind<SearchResultService>(TYPES.searchResultService).to(SearchResultService).inSingletonScope();
container.bind<AxioClientService>(TYPES.axioClientService).to(AxioClientService);

export default container;