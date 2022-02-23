import { generateUniqueID } from "../utils/id-generator";

export class CategoryModel {
	id: string;
	name: string;

	// Repository ids - ref list
	repositories: string[] = [];	

	public constructor(name: string) {
		this.id = generateUniqueID();
		this.name = name;
	}
}