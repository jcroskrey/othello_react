'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, createContext} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Game from './components/game';

export const LastMessageContext = createContext(null);

export default function PvPPage() {
    const searchParams = useSearchParams();
    const matchId = searchParams.get('id');
    const socketUrl = "ws://localhost:8000/ws/server/" + matchId + "/"

    const [messageHistory, setMessageHistory] = useState([]);
    const [team, setTeam] = useState(undefined);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);
    useEffect(() => {
        if (lastJsonMessage !== null) {
            if (lastJsonMessage.hasOwnProperty('grid')) {
                setMessageHistory(
                    (prev) => prev.concat(lastJsonMessage.grid));
                }
            else if (lastJsonMessage.hasOwnProperty('signature')) {
                // we only receive team when initally joining match
                console.log("Received my signature and team");
                console.log(lastJsonMessage);
                setTeam(lastJsonMessage.isClientA ? 0 : 1); // 0 is team black, 1 is team white
            }
        }
    }, [lastJsonMessage]);
    

    const handleClickSendMessage = useCallback((grid, toWhite, toBlack, signedBy) => sendJsonMessage({ 
        grid: grid,
        toWhite: toWhite,
        toBlack: toBlack, 
        signedBy: signedBy,
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
                    handleSendMessage={handleClickSendMessage}
                    team={team}
                >
                    

                </Game>
            </LastMessageContext.Provider>
            <div>
                <textarea id="chat-log" cols="100" rows="20" value={messageHistory} readOnly></textarea><br />
                Match ID is: {matchId}
            </div>
            <div>
                <button
                    onClick={() => handleClickSendMessage('stinky')}
                //disabled={readyState !== ReadyState.OPEN}
                >
                    Click Me to send 'Hello'
                </button>
                Connection Status: {connectionStatus}
            </div>
        </>


    )
}
