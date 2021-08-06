import { Memento } from "vscode";

export class LocalStorageService {
  
   constructor(private storage: Memento) { }   

   public getValue<T>(key : string) {
      return this.storage.get<T>(key);
   }

   public setValue<T>(key : string, value : T | undefined){
      this.storage.update(key, value);
   }

   public clearValues(key : string){
      this.storage.update(key, null);
   }
}