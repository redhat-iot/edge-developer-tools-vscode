export class Platform {
    static identify<T>(map: { [key: string]: () => T }): T {
        if (map[Platform.OS]) {
            return map[Platform.OS]();
        }
        return map.default ? map.default() : undefined;
    }

    static getOS(): string {
        return process.platform;
    }

    static get OS(): string {
        return Platform.getOS();
    }

    static get ENV(): NodeJS.ProcessEnv {
        return Platform.getEnv();
    }

    static getEnv(): NodeJS.ProcessEnv {
        return process.env;
    }

    static getUserHomePath(): string {
        return Platform.identify({
            win32: () => Platform.ENV.USERPROFILE,
            default: () => Platform.ENV.HOME,
        });
    }
}