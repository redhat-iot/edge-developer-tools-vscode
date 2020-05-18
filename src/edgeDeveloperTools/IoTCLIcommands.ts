import { IoTCLIImpl, IoTCLI, Command} from "../IoTCLI";
import { vsCommand } from '../vscommand';
import * as vscode from "vscode";

export class IoTCLICommands { 
    protected static readonly iotcli: IoTCLI = IoTCLIImpl.Instance;

    @vsCommand("edgeDeveloperTools.login")
    public async openShiftLogin():Promise<void>{ 
        
    return(await IoTCLICommands.iotcli.executeInTerminal(Command.login(),process.cwd())); 
    }

    @vsCommand("edgeDeveloperTools.ceph.setup")
    public async cephSetup():Promise<void>{
       return(await IoTCLICommands.iotcli.executeInTerminal(Command.cephSetup(), process.cwd())); 
    }

    @vsCommand("edgeDeveloperTools.ceph.user")
    public async cephUser():Promise<void>{
        const input = await vscode.window.showInputBox({prompt: "Enter the Ceph user name you would like to create:"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.cephUser(input))); 
    }

    @vsCommand("edgeDeveloperTools.ceph.secrets")
    public async cephSecrets():Promise<void>{
        const input = await vscode.window.showInputBox({prompt: "Enter the Ceph user name you would to get the credentials for:"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.cephSecrets(input))); 
    }

    @vsCommand("edgeDeveloperTools.enmasse.destroy")
    public async enmasseDestoy():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace that contains the Enmasse Messaging Core defaults to 'enmasse-infra'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.enmasseDestroy(namespace))); 
    }

    @vsCommand("edgeDeveloperTools.enmasse.setup")
    public async enmasseSetup():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace for Enmasse messaging core defaults to 'enmasse-infra'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.enmasseDestroy(namespace))); 
    }

    @vsCommand("edgeDeveloperTools.enmasse.IoT.addDevice")
    public async enmasseAddDevice():Promise<void>{
        const tenant =  await vscode.window.showInputBox({prompt: "Enter the Messaging tenant you would like to add a Device to:"});
        const deviceID =  await vscode.window.showInputBox({prompt: "Add an ID for the IoT device:"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.enmasseIoTAddDevice(tenant,deviceID))); 
    }

    @vsCommand("edgeDeveloperTools.enmasse.IoT.project")
    public async createProject():Promise<void>{ 
        const namespace =  await vscode.window.showInputBox({prompt: "Enter a namespace for your new IoT project, defaults to 'myapp'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.enmasseIoTproject(namespace))); 
    }

    @vsCommand("edgeDeveloperTools.kafka.setup")
    public async kafkaSetup():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter a namespace for Kafka messaging core, defaults to 'kafka'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.kafkaSetup(namespace)));
    }

    @vsCommand("edgeDeveloperTools.kafka.destroy")
    public async kafkaDestroy():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter a namespace that contains the Kafka messaging core, defaults to 'kafka'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.kafkaDestroy(namespace)));
    }

    @vsCommand("edgeDeveloperTools.kafka.bridge")
    public async kafkaBridge():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter a namespace that contains the Kafka messaging core, defaults to 'kafka'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.kafkaBridge(namespace)));
    }
    
    @vsCommand("edgDeveloperTools.knative.destroy")
    public async knativeDestroy():Promise<void>{
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeDestroy()));
    }


    @vsCommand("edgeDeveloperTools.knative.setup")
    public async knativeSetup():Promise<void>{
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeSetup(), process.cwd()));
        
    }

    @vsCommand("edgeDeveloperTools.knative.service")
    public async knativeService():Promise<void>{
        const serviceName =  await vscode.window.showInputBox({prompt: "Enter the knative service you would like to deploy"});
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy the Knative Service: " + serviceName, ignoreFocusOut:true} );
        if(serviceName === "video-analytics" || serviceName === "video-serving"){ 
            const cephEndpoint =  await vscode.window.showInputBox({prompt: "Enter the ceph endpoint for the Knative Service: " + serviceName, ignoreFocusOut:true});
            const cephAccessKey =  await vscode.window.showInputBox({prompt: "Enter the ceph access key the Knative Service: " + serviceName, ignoreFocusOut:true});
            const cephSecretKey =  await vscode.window.showInputBox({prompt: "Enter the ceph secret key the Knative Service: " + serviceName, ignoreFocusOut:true});
            return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeService(serviceName, namespace, cephEndpoint,cephAccessKey, cephSecretKey)));
        }else{
            return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeService(serviceName, namespace)));
        }
    }
    @vsCommand("edgeDeveloperTools.knative.service.status")
    public async knativeServiceStatus():Promise<void>{ 
        const serviceName =  await vscode.window.showInputBox({prompt: "Enter the knative service you would like to deploy"});
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy the Knative Service: " + serviceName, ignoreFocusOut:true} );
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeServiceStatus(serviceName, namespace)));

    }

    @vsCommand("edgeDeveloperTools.knative.service.destroy")
    public async knativeServiceDestroy():Promise<void>{
        const serviceName =  await vscode.window.showInputBox({prompt: "Enter the knative service you would like to deploy"});
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy the Knative Service: " + serviceName  + "defaults to 'knative-eventing'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeServiceDestroy(serviceName, namespace)));
    }

    @vsCommand("edgeDeveloperTools.knative.source")
    public async knativeSource():Promise<void>{
        const sourceName = await vscode.window.showInputBox({prompt: "Enter the knative source you would like to deploy"});
        const sourceSink = await vscode.window.showInputBox({prompt: "Enter the knative service you would like to connect the source to"});
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy the Knative Source: " + sourceName + " defaults to 'knative-eventing'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeSource(sourceName,sourceSink, namespace))); 
    }

    @vsCommand("edgeDeveloperTools.knative.source.destroy")
    public async knativeSourceDestroy():Promise<void>{
        const sourceName = await vscode.window.showInputBox({prompt: "Enter the knative source you would like to deploy"});
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy the Knative Source: " + sourceName + "defaults to 'knative-eventing'"});
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.knativeSource(sourceName, namespace))); 
    }

    @vsCommand("edgeDeveloperTools.tensorflowServing.setup")
    public async tensorflowServingSetup():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to deploy Tensorflow Serving, defaults to 'default'"}); 
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.tensorflowServingSetup(namespace))); 
    }

    @vsCommand("edgeDeveloperTools.tensorflowServing.destroy")
    public async tensorflowServingDestroy():Promise<void>{
        const namespace =  await vscode.window.showInputBox({prompt: "Enter the namespace to remove Tensorflow Serving from, defaults to 'default'"}); 
        return(await IoTCLICommands.iotcli.executeInTerminal(Command.tensorflowServingDestroy(namespace))); 
    }

}