import Cookies from 'js-cookie';
import { usePlayer } from '../My_Profile/PlayerContext';
import Game_Remot from "./Game_Remot";
import { useEffect, useState, createContext, useContext } from 'react';
import Player_Profil from '../../components/ui/game_comp/loby_profil';
import { TournContext } from './TournContext';

function Game_Tourn() {
    const matchdata = useContext(TournContext);

    return (
        <>
        </>
    );
}

export default Game_Tourn;