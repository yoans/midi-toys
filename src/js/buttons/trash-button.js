import React from 'react';
import {TrashIcon} from './icons';
export const TrashButton = ({onClick}) => (
    <button className="TrashButton isEnabled" onClick={onClick}>
        <TrashIcon></TrashIcon>
    </button>
)