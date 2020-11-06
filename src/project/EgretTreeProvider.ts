
import * as vscode from "vscode";
import * as helper from "../helper";
import EgretTreeItem from "./EgretTreeItem";

export default class EgretTreeProvider implements vscode.TreeDataProvider<EgretTreeItem>{
    private _onDidChangeTreeData: vscode.EventEmitter<EgretTreeItem | undefined | void> = new vscode.EventEmitter<EgretTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<EgretTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element: EgretTreeItem): vscode.TreeItem {
        return element;
    }
    getChildren(element?: EgretTreeItem): Thenable<EgretTreeItem[]> {
        let result: EgretTreeItem[] = [];
        result.push(new EgretTreeItem("创建Egret项目", "create.svg", {
            command: 'egret-helper-launcher.create',
            title: 'create'
        }))
        if (helper.getCurRootPath()) {
            result.push(
                new EgretTreeItem("发布Egret项目", "publish.svg", {
                    command: 'egret-helper-launcher.publish',
                    title: 'publish'
                }),
            );
        }

        return Promise.resolve(result);
    }
}