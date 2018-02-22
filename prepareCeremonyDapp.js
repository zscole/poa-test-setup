const fs = require('fs');
const Constants = require("./utils/constants");
const constants = Constants.constants;
const utils = require("./utils/utils");

main()

function main() {
	const pathToAddressesJSON = `${constants.pathToContractRepo}/${constants.addressesSourceFile}`;
	const addresses = JSON.parse(fs.readFileSync(pathToAddressesJSON));

	const addition = `const local = { "KEYS_MANAGER_ADDRESS": "${addresses.KEYS_MANAGER_ADDRESS}" };`

	let addressesFromDapp = fs.readFileSync(`${constants.pathToCeremonyDAppRepo}/src/addresses.js`, 'utf8');
	
	let lastImport = `import helpers from "./helpers";`;
	let lines = addressesFromDapp.split('\n');
	lines = lines.map((line) => {
		if (line.includes(lastImport)) {
			return lastImport + addition
		} else {
			return line
		}
	})
	addressesFromDapp = lines.join(`\n`);
	addressesFromDapp = addressesFromDapp.replace('resolve({addresses: json', 'resolve({addresses: local')

	fs.writeFileSync(`${constants.pathToCeremonyDAppRepo}/src/addresses.js`, addressesFromDapp);

	console.log("Ceremony Repo is prepared");
}