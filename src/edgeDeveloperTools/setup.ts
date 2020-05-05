import * as vscode from 'vscode';
import {CliChannel} from "../cli";
import { ChildProcess } from 'child_process';
import * as childProcess from 'child_process';
import {ToolsConfig} from "../tools";
import { WindowUtil } from '../utils/windowUtils';
export class Setup {

    public static helloworld = async (name: string = 'world'):Promise<null> =>{
        
        console.log(`Hello ${name}!!!`);
        vscode.window.showInformationMessage(`Hello ${name}!!!`);
        console.log("Testing Tool Setup"); 
        //console.log(ToolsConfig.tools);
        const toolLocation = await ToolsConfig.detect("IoTCLI");
   
        console.log("Location of the IoTCLI", toolLocation);
        
        console.log("Testing CLI"); 
        const cli = CliChannel.getInstance(); 
        const command = toolLocation + " login"; 
        const options: childProcess.ExecOptions = {};
        console.log("Command being processed", command); 
        
        const terminal: vscode.Terminal = WindowUtil.createTerminal("EdgeDeveloperTools", process.cwd()); 
        terminal.sendText(command, true);
        terminal.show();

        /*
        const ls = cli.execute(command,options); 
        ls.stdin.write("kubeadmin"); 
        ls.stdin.write("5PEEb-N6UyP-VaNM2-PXu8G");
        ls.then(value => {
            console.log('Resolved',value); 
        }); 
        ls.catch(error => {
            console.log('rejected', error);
        }); 
        */
        
        
        /*const ls2 = childProcess.spawn(command,[],); 
        //ls2.stdout.pipe("kubeadmin hi"); 
        //ls2.stderr.pipe(process.stderr); 
        //ls2.stdin.write('kubeadmin'); 
        //ls2.stdin.write('5PEEb-N6UyP-VaNM2-PXu8G');
       
        ls2.stderr.on('data', function(data) {
            console.log(Buffer.from(data, 'utf-8').toString());
        });

        ls2.stdout.on('data', function(data) {
            console.log(Buffer.from(data, 'utf-8').toString());
        });

        ls2.kill(); 
        */
          
        return(new Promise<null>(null));
        
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