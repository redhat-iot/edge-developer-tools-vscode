import * as vscode from 'vscode';

export class setup {

    static helloworld(name: string = 'world'){
        
        console.log(`Hello ${name}!!!`);
        vscode.window.showInformationMessage(`Hello ${name}!!!`);
          
    }
}