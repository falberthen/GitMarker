import { ExtensionContext, SecretStorage } from "vscode";

export default class SecretManager {
    
    private static _instance: SecretManager;

    constructor(private secretStorage: SecretStorage) {}

    static init(context: ExtensionContext): void {
        SecretManager._instance = new SecretManager(context.secrets);
    }

    static get instance(): SecretManager {
        return SecretManager._instance;
    }

    async storeSecret(key: string, value?: string): Promise<void> {
        if (key && value) {
            this.secretStorage.store(key, value);
        }
    }

    async getSecret(key: string): Promise<string | undefined> {
        return await this.secretStorage.get(key);
    }
}