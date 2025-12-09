// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";

contract IdentityRegistryScript is Script {
    IdentityRegistry public identityRegistry;

    function setUp() public {}

    function run() public {
        uint256 deployer = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployer);

        identityRegistry = new IdentityRegistry();

        vm.stopBroadcast();

        string memory root = vm.projectRoot();
        string memory deployPath = string.concat(root, "/script/deploymentRegistry.json");
        if (vm.exists(deployPath)) {
            vm.removeFile(deployPath);
        }
        vm.writeFile(deployPath, vm.serializeAddress("", "identity", address(identityRegistry)));
    }
}
