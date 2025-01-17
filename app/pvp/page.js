'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useCallback, createContext} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Game from './components/game';

export const LastMessageContext = createContext(null);

export default function PvPPage() {
    const searchParams = useSearchParams();
    const matchId = searchParams.get('id');
    const socketUrl = "ws://localhost:8001/ws/server/" + matchId + "/"

    let initialGrid = Array(8).fill().map(() => Array(8).fill(null));
    const [grid, setGrid] = useState(initialGrid);
    const [currentMove, setCurrentMove] = useState(0);
    const [team, setTeam] = useState(1);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);
    useEffect(() => {
        if (lastJsonMessage !== null) {
            console.log(lastJsonMessage);
            setGrid(lastJsonMessage.grid);
            setCurrentMove(currentMove);
            setTeam(team);
        }
    }, [lastJsonMessage]);
    

    const handleClickSendMessage = useCallback((type, team, row, col) => sendJsonMessage({ 
        type: type,
        team: team,
        row: row, 
        col: col,
    }));
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <>
            <LastMessageContext.Provider value={lastJsonMessage}>
                <Game
                    handleSendMessage={() => handleClickSendMessage()}
                    team={team}
                    currentMove={currentMove}
                    currentGrid={grid}
                >
                    

                </Game>
            </LastMessageContext.Provider>
            <div>
                Match ID is: {matchId}
            </div>
            <div>
               Connection Status: {connectionStatus}
            </div>
        </>


    )
}
