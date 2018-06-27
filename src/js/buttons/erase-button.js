import React from 'react';
import {EraseIcon} from './icons';
export const EraseButton = ({onClick, isErasing}) => (
    <button className={"EditButton isEnabled"+ (isErasing ? " ActiveControl":"")} onClick={onClick}>
        <EraseIcon></EraseIcon>
    </button>
)