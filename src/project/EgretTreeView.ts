import * as cp from "child_process";
import * as fs from "fs";
import * as vscode from "vscode";
import Listener from "../common/Listener";
import * as helper from "../helper";
import Launcher from "../launcher/launcher";
import EgretTreeProvider from "./EgretTreeProvider";

export default class EgretTreeView extends Listener {
    private provider: EgretTreeProvider;
    public constructor(protected subscriptions: vscode.Disposable[]) {
        super();
        this.provider = new EgretTreeProvider();
        this.addListener(
            vscode.window.registerTreeDataProvider('egretProject', this.provider)
        )
        this.addListener(
            vscode.commands.registerCommand('egret-helper-launcher.create', () => {
                Launcher.createProject().then(result => {
                    if (result == "cancel") {
                        //取消了
                    } else if (fs.existsSync(result)) {
                        //创建了并返回了路径
                        console.log("open:" + result);
                        const spawnObj = cp.exec(`code .`,{cwd:result}, (err, stdout, stderr) => {
                            if(err){
                                console.error(err.message);
                            }
                            if(stdout){
                                console.log(stdout);
                            }
                            if(stderr){
                                console.error(stderr);
                            }
                        })
                        spawnObj.stdout.on('data', (chunk) => {
                            console.log(chunk);
                        });
                        spawnObj.stderr.on('data', (data) => {
                            console.error(data);
                        });
                        spawnObj.on('close', (code) => {
                            console.log('close code : ' + code);
                        });
                        spawnObj.on('exit', (code, signal) => {
                            console.log("exit code:" + code);
                        });
                    }
                }).catch(err => vscode.window.showErrorMessage(err));
            })
        )
        this.addListener(
            vscode.commands.registerCommand('egret-helper-launcher.publish', () => {
                let curRootPath = helper.getCurRootPath();
                if (curRootPath) {
                    Launcher.publishProject(curRootPath.uri.fsPath).catch(err => vscode.window.showErrorMessage(err));
                }
            })
        )

    }
    public update() {
        if (this.provider) {
            this.provider.refresh();
        }
    }
}