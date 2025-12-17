// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {ValidationRegistry} from "../src/ValidationRegistry.sol";

contract ValidationRegistryScript is Script {
    ValidationRegistry public validationRegistry;

    function setUp() public {}

    function run() public {
        string memory root = vm.projectRoot();
        string memory deployPath = string.concat(root, "/script/deploymentRegistry.json");
        string memory json = vm.readFile(deployPath);
        address identityRegistry = vm.parseJsonAddress(json, "$.identity");

        uint256 deployer = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployer);

        validationRegistry = new ValidationRegistry(identityRegistry);

        vm.stopBroadcast();

        string memory validationPath = string.concat(root, "/script/deploymentValidation.json");
        if (vm.exists(validationPath)) {
            vm.removeFile(validationPath);
        }
        vm.writeFile(validationPath, vm.serializeAddress("", "validation", address(validationRegistry)));
    }
}
