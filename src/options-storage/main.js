import { browser } from "webextension-polyfill-ts";
import OptionsSync from 'webext-options-sync';

function saveOptions(e) {
	e.preventDefault();
	browser.storage.sync.set({
		hidden: document.querySelector("#color").value
	});
}

export default new OptionsSync({
	defaults: {
		colorRed: 244,
		colorGreen: 67,
		colorBlue: 54
	},
	migrations: [
		OptionsSync.migrations.removeUnused
	],
	logging: true
});
