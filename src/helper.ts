import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ConfigObj } from "./define";

export function getConfigObj() {
	return <ConfigObj>vscode.workspace.getConfiguration("egret-helper");
}
export function getCurRootPath() {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		for (const workspaceFolder of workspaceFolders) {
			const folderString = workspaceFolder.uri.fsPath;
			if (!folderString) {
				continue;
			}
			const egretConfig = path.join(folderString, "egretProperties.json");
			if (!fs.existsSync(egretConfig)) {
				continue;
			}
			return workspaceFolder;
		}
	}
	return null;
}


export function loopFile(file: string, fileFun: (file: string) => void) {
	let state = fs.statSync(file);
	if (state.isDirectory()) {
		let dirs = fs.readdirSync(file);
		for (let i = 0; i < dirs.length; i++) {
			loopFile(path.join(file, dirs[i]), fileFun);
		}
	} else {
		fileFun(file);
	}
};
export function writeFile(file: string, data: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, (err) => {
			if (err) reject(err);
			else resolve();
		})
	})
}

export function fillNum(num: string | number) {
	let _num = +num;
	if (isNaN(_num)) return `${num}`;
	else if (_num < 10) return `0${_num}`;
	else return `${_num}`;
}