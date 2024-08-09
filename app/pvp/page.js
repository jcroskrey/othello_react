'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Game from './components/game';

export default function PvPPage() {
    const searchParams = useSearchParams();
    const matchId = searchParams.get('id');
    const socketUrl = "ws://localhost:8000/ws/server/" + matchId + "/"

    const [messageHistory, setMessageHistory] = useState([]);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastJsonMessage !== null) {
            setMessageHistory(
                (prev) => prev.concat(lastJsonMessage.grid));
        }
    }, [lastJsonMessage]);

    const handleClickSendMessage = useCallback((grid, toWhite, toBlack) => sendJsonMessage({ 
        grid: grid,
        toWhite: toWhite,
        toBlack: toBlack, 
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
            <Game
                handleSendMessage={handleClickSendMessage}>
                readyState={readyState}
                messageHistory={messageHistory}

            </Game>
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
