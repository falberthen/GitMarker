import { CategoryModel } from "./category-model";
import { GithubRepositoryModel } from "./github-repository-model";

// Storable object with Categories and Repositories
export class CategoriesRepositoriesModel {
	categories: CategoryModel[] = [];
	repositories: GithubRepositoryModel[] = [];
}