import { ProviderResult, TreeItemCollapsibleState, window, Terminal, Uri, commands, QuickPickItem, workspace, WorkspaceFoldersChangeEvent, WorkspaceFolder, Command as VSCommand, Disposable } from 'vscode';

import * as cliInstance from './cli';
import { WindowUtil } from './utils/windowUtils';
import { ToolsConfig } from './tools';


export class Command{ 

    static cephSetup():string { 
        return 'IoTCLI ceph setup'; 
    }

    static cephSecrets():string { 
        return 'IoTCLI ceph secrets'; 
    }

    static cephDestroy():string { 
        return 'IoTCLI ceph destroy'; 
    }
    
    static enmasseDestroy(nameSpace?: string):string{ 
        if (nameSpace === undefined){ 
            return 'IoTCLI enmasse destroy'; 
        }else{
            return 'IoTCLI enmasse destroy -n ${nameSpace}';
        }
    }

    static enmasseSetup(nameSpace?:string):string{ 
        if (nameSpace === undefined){ 
            return 'IoTCLI enmasse setup'; 
        }else{
            return 'IoTCLI enmasse setup -n ${nameSpace}';
        }
    }

    static enmasseIoTAddDevice(messagingTenant:string,deviceID:string):string{ 
        return 'IoTCLI enmasse IoT addDevice ${messagingTenant} ${deviceID'; 
    }

    static enmasseIoTproject(nameSpace?:string):string{
        if(nameSpace === undefined){
            return 'IoTCLI enmasse IoT project'; 
        }else{ 
            return 'IoTCLI enmasse IoT project -n ${nameSpace}'; 
        }    
    }

    static kafkaSetup(nameSpace?:string):string{ 
        if(nameSpace === undefined){
            return 'IoTCLI kafka setup'; 
        }else{ 
            return 'IoTCLI kafka setup -n ${nameSpace}'; 
        }
        
    }
    
    static kafkaDestroy(nameSpace?:string):string{ 
        if(nameSpace === undefined){
            return 'IoTCLI kafka destroy'; 
        }else{ 
            return 'IoTCLI kafka destroy -n ${nameSpace}'; 
        }
    }

    static kafkaBridge(nameSpace?:string):string{
        if(nameSpace === undefined){
            return 'IoTCLI kafka bridge'; 
        }else{ 
            return 'IoTCLI kafka bridge -n ${nameSpace}'; 
        }
    }

    static knativeSetup(status: string = 'false'):string{ 
        return 'IoTCLI knative setup --status ${status}'; 
    }

    static knativeDestroy():string{
        return 'IoTCLI knative destroy'; 
    }

    static knativeService(serviceName:string, nameSpace:string = 'knative-eventing'):string{
        return 'IoTCLI knative service ${serviceName} -n ${nameSpace}'; 
    }

    static knativeServiceDestroy(serviceName:string, nameSpace:string = 'knative-eventing'):string{
        return 'IoTCLI knative service destroy ${serviceName} -n ${nameSpace}'; 
    }
    static knativeSource(serviceName:string, nameSpace:string = 'knative-eventing'):string{
        return 'IoTCLI knative source ${serviceName} -n ${nameSpace}'; 
    }

    static knativeSourceDestroy(serviceName:string, nameSpace:string = 'knative-eventing'):string{
        return 'IoTCLI knative source destroy ${serviceName} -n ${nameSpace}'; 
    }

    static tensorflowServingSetup(nameSpace:string = 'default'){
        return 'IoTCLI tensorflowServing setup -n ${nameSpace}'; 
    }

    static tensorflowServingDestroy(nameSpace:string = 'default'){
        return 'IoTCLI tensorflowServing destroy -n ${nameSpace}'; 
    }

    static login():string{
        return 'IoTCLI login'; 
    }


}   

export interface IoTCLI {
    openShiftLogin(): Promise<void>
    execute(command: string, cwd?: string, fail?: boolean): Promise<cliInstance.CliExitData>;
    //spawn(command: string, cwd?: string): Promise<ChildProcess>;
    executeInTerminal(command: string, cwd?: string, name?: string): Promise<void>;
   
}

export class IoTCLIImpl implements IoTCLI {

    private static cli: cliInstance.Cli = cliInstance.CliChannel.getInstance();


    public async openShiftLogin():Promise<void>{ 
        return(this.executeInTerminal(Command.login(),process.cwd())); 

    }

    public async executeInTerminal(command: string, cwd: string = process.cwd(), name = 'edgeDeveloperTools'): Promise<void> {
        const cmd = command.split(' ')[0];
        const toolLocation = await ToolsConfig.detect(cmd);
        const terminal: Terminal = WindowUtil.createTerminal(name, cwd);
        terminal.sendText(toolLocation === cmd ? command : command.replace(cmd, `"${toolLocation}"`).replace(new RegExp(`&& ${cmd}`, 'g'), `&& "${toolLocation}"`), true);
        terminal.show();
    }

    public async execute(command: string, cwd?: string, fail = true): Promise<cliInstance.CliExitData> {
        const cmd = command.split(' ')[0];
        const toolLocation = await ToolsConfig.detect(cmd);
        return IoTCLIImpl.cli.execute(
            toolLocation ? command.replace(cmd, `"${toolLocation}"`).replace(new RegExp(`&& ${cmd}`, 'g'), `&& "${toolLocation}"`) : command,
            cwd ? {cwd} : { }
        ).then(async (result) => result.error && fail ?  Promise.reject(result.error) : result).catch((err) => fail ? Promise.reject(err) : Promise.resolve({error: null, stdout: '', stderr: ''}));
    }
}
