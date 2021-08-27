import { ValidateNested } from "class-validator";
import { Category } from "./category";
import { GithubRepository } from "./github-repository";

// Storable object with Categories and Repositories
export class CategoriesRepositories {
	categories: Category[] = [];
	
	@ValidateNested()
	repositories: GithubRepository[] = [];
}