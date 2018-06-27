import React from 'react';
import {ArrowIcon} from './icons';
export const ArrowButton = ({onClick, direction}) => (
    <button className={"ArrowButton isEnabled"} onClick={onClick}>
        <ArrowIcon direction={direction}></ArrowIcon>
    </button>
)