// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Weather is Ownable{

    int temperature;
    address private relayer;
    uint decimals = 4;

    constructor(address _relayer) {
        setRelayer(_relayer);
    }

    function updateTemperature(int temp) onlyRelayer public {
        temperature = temp;
    }

    function getTemperature() public view returns(int) {
        return temperature;
    }

    function getRoundedTemperature() public view returns(int) {
        return temperature / int(10**decimals);
    }

    function getRelayer() public view returns(address) {
        return relayer;
    }

    function setRelayer(address _relayer) onlyOwner public {
        relayer = _relayer;
    }

    function setDecimals(uint _decimals) onlyRelayer public {
        decimals = _decimals;
    }

    function getDecimals() public view returns(uint) {
        return decimals;
    }

    function _checkRelayer() internal view virtual {
        require(relayer == msg.sender, "Caller is not the relayer");
    }

    modifier onlyRelayer {
        _checkRelayer();
        _;
    }

}
