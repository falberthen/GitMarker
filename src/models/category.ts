import { ValidateNested } from "class-validator";
import { generateUniqueID } from "../utils/id-generator";
import { GithubRepository } from "./github-repository";

export class Category {
   id: string;
   name: string;

   @ValidateNested()
   repositories: GithubRepository[] = [];	

   public constructor(name: string) {
      this.id = generateUniqueID();
      this.name = name;
   }
}