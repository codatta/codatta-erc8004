// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {ReputationRegistry} from "../src/ReputationRegistry.sol";

contract ReputationRegistryScript is Script {
    ReputationRegistry public reputationRegistry;

    function setUp() public {}

    function run() public {
        string memory root = vm.projectRoot();
        string memory deployPath = string.concat(root, "/script/deploymentRegistry.json");
        string memory json = vm.readFile(deployPath);
        address identityRegistry = vm.parseJsonAddress(json, "$.identity");

        uint256 deployer = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployer);

        reputationRegistry = new ReputationRegistry(identityRegistry);

        vm.stopBroadcast();

        string memory reputationPath = string.concat(root, "/script/deploymentReputation.json");
        if (vm.exists(reputationPath)) {
            vm.removeFile(reputationPath);
        }
        vm.writeFile(reputationPath, vm.serializeAddress("", "reputation", address(reputationRegistry)));
    }
}
