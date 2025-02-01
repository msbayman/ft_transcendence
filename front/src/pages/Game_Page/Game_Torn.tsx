import { useEffect, useState, createContext, useContext } from 'react';
import { TournContext } from './TournContext';
import Tournaments from './Tournaments';

function Tourn_manage() {
    const matchdata = useContext(TournContext);
   

    return (
        <>
            <Tournaments/>
        </>
    );
}

export default Tourn_manage;