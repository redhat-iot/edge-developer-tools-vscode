import { IoTCLIImpl, IoTCLI, Command} from "../IoTCLI";
import { vsCommand } from '../vscommand';
import * as cliInstance from '../cli';

export class IoTCLICommands { 
    protected static readonly iotcli: IoTCLI = IoTCLIImpl.Instance;

    @vsCommand("edgeDeveloperTools.login")
    public async openShiftLogin():Promise<void>{ 
        
    return(await IoTCLICommands.iotcli.executeInTerminal(Command.login(),process.cwd())); 
    }

    @vsCommand("edgeDeveloperTools.knative.setup")
    public async knativeSetup(){
        await IoTCLICommands.iotcli.executeInTerminal(Command.knativeSetup(), process.cwd());
        
    }

}