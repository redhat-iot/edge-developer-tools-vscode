import { window, Terminal, TerminalOptions } from 'vscode';

export class WindowUtil {
    static createTerminal(name: string, cwd: string): Terminal {
        const options: TerminalOptions = {
            cwd,
            name,
            shellPath: process.platform === 'win32' ? process.env.ComSpec : '/bin/bash',
        };
        return window.createTerminal(options);
    }
}