import { ContextService } from "./context-service";
import { injectable } from "inversify";
import { Memento } from "vscode";

@injectable()
export class DataStorageService {
	private storage: Memento;

	constructor() {
		this.storage = ContextService.instance.
			context.globalState;
	}   

	public getValue<T>(key : string) {
		return this.storage.get<T>(key);
	}

	public setValue<T>(key : string, value : T) {
		this.storage.update(key, value);
	}

	public clearValues(key : string) {
		this.storage.update(key, undefined);
	}
}