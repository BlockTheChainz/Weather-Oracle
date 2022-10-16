// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Weather.sol";

contract Manager {

    address weatherOracle = address(0xC53029ef10f3B1F6D02a09dB017eB316d2f23edF);

    function checkTemperature() public view returns(string memory) {
        Weather weather = Weather(weatherOracle);
        int temperature = weather.getRoundedTemperature();
        if(temperature < 0) {
            return "freezing";
        } else if(temperature <= 10) {
            return "cold";
        } else if(temperature <= 20) {
            return "moderate";
        } else if(temperature <= 30) {
            return "hot";
        } else if(temperature <= 40) {
            return "burning";
        } else {
            return "Egipt";
        }
    }

}
