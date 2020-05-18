import { ProviderResult, TreeItemCollapsibleState, window, Terminal, Uri, commands, QuickPickItem, workspace, WorkspaceFoldersChangeEvent, WorkspaceFolder, Command as VSCommand, Disposable } from 'vscode';

import * as cliInstance from './cli';
import { WindowUtil } from './utils/windowUtils';
import { ToolsConfig } from './tools';
import { vsCommand } from './vscommand';
import { opendir } from 'fs';

export class Command{ 

    static cephUser(user: string){
        return `IoTCLI ceph user ${user}`; 
    }

    static cephSetup():string { 
        return 'IoTCLI ceph setup'; 
    }

    static cephSecrets(user: string):string { 
        return `IoTCLI ceph secrets ${user}`; 
    }

    static cephDestroy():string { 
        return 'IoTCLI ceph destroy'; 
    }
    
    static enmasseDestroy(nameSpace: string = "enmasse-infra"):string{ 
       return `IoTCLI enmasse destroy`;    
    }

    static enmasseSetup(nameSpace: string = "enmasse-infra"):string{ 
        return `IoTCLI enmasse setup -n ${nameSpace}`;
    
    }

    static enmasseIoTAddDevice(messagingTenant:string,deviceID:string):string{ 
        return `IoTCLI enmasse IoT addDevice ${messagingTenant} ${deviceID}`; 
    }

    static enmasseIoTproject(nameSpace: string = "myapp"):string{
        return `IoTCLI enmasse IoT project -n ${nameSpace}`;        
    }

    static kafkaSetup(nameSpace: string = "kafka"):string{    
        return `IoTCLI kafka setup -n ${nameSpace}`; 
    }
    
    static kafkaDestroy(nameSpace: string = "kafka"):string{ 
        return `IoTCLI kafka destroy -n ${nameSpace}`; 
    }

    static kafkaBridge(nameSpace: string = "kafka"):string{
        return `IoTCLI kafka bridge -n ${nameSpace}`; 
    }

    static knativeSetup(status: string = 'false'):string{ 
        return `IoTCLI knative setup`; 
    }

    static knativeDestroy():string{
        return 'IoTCLI knative destroy'; 
    }

    static knativeService(serviceName:string, nameSpace:string = 'knative-eventing',cephEndpoint?, cephAccessKey?,cephSecretKey?):string{
        if (serviceName === "video-analytics" || serviceName === "video-serving"){
            return `IoTCLI knative service ${serviceName} -n ${nameSpace} --cephEndpoint ${cephEndpoint} --cephAccessKey ${cephAccessKey} --cephSecretKey ${cephSecretKey}`;
        }else {
            return `IoTCLI knative service ${serviceName} -n ${nameSpace}`; 
        }
    }

    static knativeServiceStatus(serviceName:string, nameSpace:string){
        return `IoTCLI knative service ${serviceName} -n ${nameSpace} --status`;
    }

    static knativeServiceDestroy(serviceName:string, nameSpace:string = 'knative-eventing'):string{
        return `IoTCLI knative service destroy ${serviceName} -n ${nameSpace}`; 
    }
    static knativeSource(sourceName:string,sourceSink:string, nameSpace:string = 'knative-eventing'):string{
        return `IoTCLI knative source ${sourceName} ${sourceSink} -n ${nameSpace}`; 
    }

    static knativeSourceDestroy(sourceName:string, nameSpace:string = 'knative-eventing'):string{
        return `IoTCLI knative source destroy ${sourceName} -n ${nameSpace}`; 
    }

    static tensorflowServingSetup(nameSpace:string = 'default'){
        return `IoTCLI tensorflowServing setup -n ${nameSpace}`; 
    }

    static tensorflowServingDestroy(nameSpace:string = 'default'){
        return `IoTCLI tensorflowServing destroy -n ${nameSpace}`; 
    }

    static login():string{
        return 'IoTCLI login'; 
    }


}   

export interface IoTCLI {
    execute(command: string, cwd?: string, fail?: boolean): Promise<cliInstance.CliExitData>;
    //spawn(command: string, cwd?: string): Promise<ChildProcess>;
    executeInTerminal(command: string, cwd?: string, name?: string): Promise<void>;
   
}

export class IoTCLIImpl implements IoTCLI {

    public static cli: cliInstance.Cli = cliInstance.CliChannel.getInstance();
    private static instance: IoTCLI;

    public static get Instance(): IoTCLI {
        if (!IoTCLIImpl.instance) {
            IoTCLIImpl.instance = new IoTCLIImpl();
        }
        return IoTCLIImpl.instance;
    }
    

    public async executeInTerminal(command: string, cwd: string = process.cwd(), name = 'edgeDeveloperTools'): Promise<void> {
        const cmd = command.split(' ')[0];
        const toolLocation = await ToolsConfig.detect(cmd);
        let terminal: Terminal; 
        if(window.activeTerminal === undefined){
            terminal = WindowUtil.createTerminal(name, cwd);
        }else{
            terminal = window.activeTerminal; 
        }

        console.log("Trying to execute with tool: ", cmd); 
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

export function getInstance(): IoTCLI {
    return IoTCLIImpl.Instance;
  }