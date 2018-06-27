import React from 'react';
import {EditIcon} from './icons';
export const EditButton = ({onClick, isEditing}) => (
    <button className={"EditButton isEnabled"+ (isEditing ? " ActiveControl":"")} onClick={onClick}>
        <EditIcon></EditIcon>
    </button>
)