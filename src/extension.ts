import * as vscode from 'vscode';
import { getLogger, Logger } from './common/Logger';
import * as helper from './helper';
import EgretTreeView from './project/EgretTreeView';
let _treeView: EgretTreeView | undefined;

let logger: Logger;
export function activate({ subscriptions }: vscode.ExtensionContext) {
	logger = getLogger("extension");
	logger.devlog("activate");
	subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(e => {
		logger.devlog("WorkspaceFolderChange", e);
		init(subscriptions);
	}));
	subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		logger.devlog("ConfigChange", e);
		init(subscriptions);
	}))
	init(subscriptions);
}
function init(subscriptions: { dispose(): any }[]) {
	logger.devlog("init");
	let enabled = helper.getConfigObj().enable;
	logger.devlog(`init enabled=`, enabled);
	if (!enabled) {
		destroy();
		return;
	}

	if (!_treeView) {
		_treeView = new EgretTreeView(subscriptions);
	} else {
		_treeView.update();
	}
}

export async function deactivate() {
	logger.devlog("deactivate");
	await destroy();
}
async function destroy() {
	logger.devlog("destroy");
	if (_treeView) {
		_treeView.destroy();
		_treeView = undefined;
	}
}