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
//
var i2c = require('i2c');

// legend: _RO = read only, _WO = write only, not specified = read/write
var ISL29125_ADDR = 0x44;
var ISL29125_DEVICE_ID_VALUE = 0x7D;
var ISL29125_DEVICE_RESET_VALUE = 0x46;
var ISL29125_DEVICE_ID_RO = 0x00;
var ISL29125_DEVICE_RESET_WO = 0x00;
var ISL29125_CONFIG_1 = 0x01;
var ISL29125_CONFIG_2 = 0x02;
var ISL29125_CONFIG_3 = 0x03;
var ISL29125_LOW_THRESHOLD_LS_BYTE = 0x04;
var ISL29125_LOW_THRESHOLD_MS_BYTE = 0x05;
var ISL29125_HIGH_THRESHOLD_LS_BYTE = 0x06;
var ISL29125_HIGH_THRESHOLD_MS_BYTE = 0x07;
var ISL29125_STATUS_FLAGS_RO = 0x08;
var ISL29125_GREEN_LS_BYTE = 0x09;
var ISL29125_GREEN_MS_BYTE = 0x0A;
var ISL29125_RED_LS_BYTE = 0x0B;
var ISL29125_RED_MS_BYTE = 0x0C;
var ISL29125_BLUE_LS_BYTE = 0x0D;
var ISL29125_BLUE_MS_BYTE = 0x0E;

var isl29125 = function(i2caddr, options) {
    "use strict";
    this.i2caddr = i2caddr;
    this.i2coptions = options;
    this.i2cdevice = new i2c(i2caddr, options);
};

isl29125.prototype.init = function(callback) {
    "use strict";
    var i2cdev = this.i2cdevice;
    // Reset the device and check for device ID to make sure it really is working
    // Next configure the device
    i2cdev.writeBytes(ISL29125_DEVICE_RESET_WO, [ISL29125_DEVICE_RESET_VALUE],
            function(err) {
                if (err) {
                    callback(err);
                }
                else {
                    i2cdev.readBytes(ISL29125_DEVICE_ID_RO, 1, function(err, data) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            if (data[0] === ISL29125_DEVICE_ID_VALUE) {
                                i2cdev.writeBytes(ISL29125_CONFIG_1,
                                    [0x15, 0x00, 0x00], function(err) {
                                        if (err) {
                                            callback(err);
                                        }
                                        else {
                                            callback(null);
                                        }
                                    });
                            }
                        }
                    });
                }
            });
};

isl29125.prototype.readRGB = function(callback) {
    "use strict";
    this.i2cdevice.readBytes(ISL29125_GREEN_LS_BYTE, 6, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            var light = {};
            light.green = (data[1] << 8) | data[0];
            light.red   = (data[3] << 8) | data[2];
            light.blue  = (data[5] << 8) | data[4];
            callback(null, light);
        }
    });
};

module.exports = isl29125;
