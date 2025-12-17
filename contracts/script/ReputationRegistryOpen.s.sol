// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ReputationRegistryOpen} from "../src/ReputationRegistryOpen.sol";

contract DeployReputationRegistryOpen is Script {
    function run() external {
        // 从环境变量读取 Identity Registry 地址
        address identityRegistry = vm.envAddress("IDENTITY_REGISTRY_ADDRESS");
        
        console.log("Deploying ReputationRegistryOpen...");
        console.log("Identity Registry:", identityRegistry);
        
        vm.startBroadcast();
        
        ReputationRegistryOpen reputation = new ReputationRegistryOpen(identityRegistry);
        
        vm.stopBroadcast();
        
        console.log("ReputationRegistryOpen deployed at:", address(reputation));
        console.log("Chain ID:", block.chainid);
        
        // 保存部署地址到文件
        string memory deploymentData = string.concat(
            '{"address":"',
            vm.toString(address(reputation)),
            '","chainId":',
            vm.toString(block.chainid),
            ',"timestamp":',
            vm.toString(block.timestamp),
            '}'
        );
        vm.writeFile("script/deploymentReputationOpen.json", deploymentData);
        console.log("Deployment info saved to: script/deploymentReputationOpen.json");
    }
}

