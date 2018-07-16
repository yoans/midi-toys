"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const onSlideChange = function (onChange) {
    return function (position, value) {
        onChange(value);
    };
};

const setSliderOnChange = exports.setSliderOnChange = function (targetIdsAndCallbacks) {
    return $(function () {
        targetIdsAndCallbacks.map(function ({ id, onChange }) {
            $(id).rangeslider({
                polyfill: false,
                onSlide: onSlideChange(onChange),
                onSlideEnd: onSlideChange(onChange)
            });
        });
    });
};