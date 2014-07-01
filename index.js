/*
The MIT License (MIT)

Copyright (c) 2014 bbx10node@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

// Demonstrate reading RGB values from an Intersil ISL29125 ligth sensor using
// node.js.
//
// Tested using a Sparkfun breakout board and a Raspberry Pi
// https://www.sparkfun.com/products/12829
//
// RGB values printed using console every second.
//
var i2c = require('i2c');
var isl29125 = require('./isl29125');

// The device is correct for Raspberry Pi but could be different on other
// systems.
var ISL29125_ADDR = 0x44;
var lightsensor = new isl29125(ISL29125_ADDR, {device: '/dev/i2c-1'});

if (lightsensor === null) {
    console.log("ISL29125 not found");
    process.exit(-1);
}

lightsensor.init(function(err) {
    "use strict";
    if (err) {
        console.log(err);
        process.exit(-2);
    }
    else {
        console.log('ISL29125 ready');
        showRGB();
    }
});

function showRGB() {
    "use strict";
    lightsensor.readRGB(function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data.red, data.green, data.blue);
        }
        setTimeout(showRGB, 1000);
    });
}
