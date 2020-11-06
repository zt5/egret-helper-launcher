import * as vscode from "vscode";
export type ConfigSyncMap = {
	[key: string]: {
		tail: string,
		type: string
	}
}
export interface ConfigObj extends vscode.WorkspaceConfiguration {
	/**插件是否可用*/
	enable: boolean;
	/**打印详细日志*/
	devlog: boolean;
}