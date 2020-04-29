import * as vscode from 'vscode';
import {CliChannel} from "../cli";
import { ChildProcess } from 'child_process';
import * as childProcess from 'child_process';
import {ToolsConfig} from "../tools";
export class Setup {

    public static helloworld = (name: string = 'world') => {
        
        console.log(`Hello ${name}!!!`);
        vscode.window.showInformationMessage(`Hello ${name}!!!`);
        console.log("Testing Tool Setup"); 
        console.log(ToolsConfig.tools);
        const result = ToolsConfig.getVersion("IoTCLI");
        
        result.then(value => { 
            console.log("Resolved", value); 
        });
       
       
        console.log("Testing CLI"); 
        const cli = CliChannel.getInstance(); 
        const command = "IoTCLI knative setup --status"; 
        const options: childProcess.ExecOptions = {cwd: vscode.workspace.rootPath};
       
        const ls = cli.execute(command,options); 
        ls.then(value => {
            console.log('resolved',value); 
        }); 
        ls.catch(error => {
            console.log('rejected', error);
        }); 
        
        /*
        ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        vscode.window.showInformationMessage(data);
        });
       
        ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        });
        
        ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        });
        */

        //const options: childProcess.ExecOptions = {cwd: 'cwd'}; 


          
    }; 

}