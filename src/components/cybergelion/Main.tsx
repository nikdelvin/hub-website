import './main.css'
import { useState, useEffect, useRef } from 'preact/hooks'
import { musicList, characters } from './functions/data'

export default function Main() {
    const [count, setCount] = useState(570442)
    const [mask, setMask] = useState(Array(28).fill('0'))
    const [dots, setDots] = useState(0)
    const [holes, setHoles] = useState(Array(15).fill([3, 14]))
    const [modal, setModal] = useState<string | null>(null)
    const [user, setUser] = useState<true | null>(null)
    const [assistant, setAssistant] = useState('/cybergelion/images/ai_lq.png')
    const [messages, setMessages] = useState<{ message: string; from: string }[]>([])
    const [currentMessage, setCurrentMessage] = useState('')
    const [music, setMusic] = useState<{ [name: string]: string | null }>({})
    const [play, setPlay] = useState('')
    const [character, setCharacter] = useState('Sasha Yakovleva')
    type Characters = Record<string, { storyline: string; answers: string[] }>
    const baseState = useRef<{
        audio?: HTMLAudioElement
    }>({})

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    async function initAnimations() {
        setTimeout(() => {
            setAssistant('/cybergelion/images/ai_hq.png')
        }, 1000)
        setInterval(() => {
            setCount(Math.floor(Math.random() * 1000000 - 1))
            setMask((mask) => {
                const newMask = [...mask]
                for (const i of Array.from(Array(mask.length).keys())) {
                    newMask[i] = Math.random() > 0.5 ? '1' : '0'
                }
                return newMask
            })
            setHoles(
                Array(15)
                    .fill(true)
                    .map(() => [getRandomInt(3, 13), getRandomInt(14, 24)])
            )
        }, 100)
        setInterval(() => {
            setDots((dots) => (dots < 3 ? dots + 1 : 0))
        }, 1000)
    }

    async function sendMessage() {
        if (currentMessage.length > 0) {
            setMessages((prevMessages) => [...prevMessages, { message: currentMessage, from: 'User' }])
            setCurrentMessage('')
            const answer = (characters as Characters)[character].answers[Math.floor(Math.random() * 9.999)]
            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, { message: answer as string, from: 'AI' }])
            }, 2000)
        }
    }

    async function audioPlayerStart(track: string, url: string | null, newIndex: number) {
        if (url == null) {
            setPlay(`loading_${track}`)
            const trackURL = `/cybergelion/music/${track}.mp3`
            baseState.current.audio!.src = trackURL
            setMusic((prevMusic) => {
                prevMusic[track] = trackURL
                return prevMusic
            })
        } else {
            if (play.replace('paused_', '') !== track) baseState.current.audio!.src = url
        }
        baseState.current.audio!.play()
        baseState.current.audio!.onended = () => {
            const setIndex = Object.keys(music)[newIndex - 1] != null ? newIndex - 1 : 9
            const newTrack = Object.keys(music)[setIndex]
            const newTrackURL = music[Object.keys(music)[setIndex]]!
            setPlay(newTrack)
            audioPlayerStart(newTrack, newTrackURL, setIndex)
        }
        setPlay(track)
    }

    useEffect(() => {
        initAnimations()
        baseState.current.audio = new Audio('')
        setMusic(Object.fromEntries(musicList.map((track) => [track, null])))
    }, [])

    return (
        <div className="cg-app-root">
            <div className="cg-app-main">
                <span className="cg-version">{`SOFTWARE VERSION: 0.${String(new Date().getFullYear()).slice(2)}.${new Date().getMonth() + 1}.${new Date().getDate()}`}</span>
                <h1 className="cg-logo">Cybergelion</h1>
                <h3 className="cg-title">WELCOME TO THE BLACKWALL</h3>
                {user != null ? (
                    <div>
                        <p className="cg-text">{`ENTRY FOUND: NC570442`}</p>
                        <button
                            className="cg-button"
                            onClick={() => {
                                setModal('characters')
                            }}
                        >
                            CHARACTERS<pre>{mask.join('')}</pre>
                        </button>
                        <button
                            className="cg-button"
                            onClick={() => {
                                setModal('chat')
                            }}
                        >
                            AI CHAT<pre>{mask.join('')}</pre>
                        </button>
                        <button
                            className="cg-button"
                            onClick={() => {
                                setUser(null)
                            }}
                        >
                            LOGOUT<pre>{mask.join('')}</pre>
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="cg-text">{`BREACHING PROTOCOL${Array(dots).fill('.').join('')}`}</p>
                        <p className="cg-text">{`SCANNING ENTRY: NC${String(count).padStart(6, '0')}`}</p>
                        <button
                            className="cg-button"
                            onClick={() => {
                                setModal('login')
                            }}
                        >
                            LOGIN<pre>{mask.join('')}</pre>
                        </button>
                        <button
                            className="cg-button"
                            onClick={() => {
                                setModal('login')
                            }}
                        >
                            REGISTER<pre>{mask.join('')}</pre>
                        </button>
                    </div>
                )}
                <div>
                    {musicList.map((track, index) => {
                        return (
                            <div
                                key={track}
                                className={`music-card ${track === play ? 'play' : play.replace('paused_', '') === track ? 'pause' : play.replace('loading_', '') === track ? 'loading' : 'stop'}`}
                            >
                                <div className="hover-area"></div>
                                <div className="hover-box">
                                    <i className="las la-caret-up"></i>
                                </div>
                                <div className="sound-mixer">
                                    {Array(12)
                                        .fill(true)
                                        .map((_, index) => (
                                            <div
                                                key={index}
                                                className="sound-bar"
                                            ></div>
                                        ))}
                                </div>
                                <div className="card-title">{`${track}.mp3`.toUpperCase()}</div>
                                {play === track ? (
                                    <div
                                        className="play-button"
                                        onClick={() => {
                                            baseState.current.audio!.pause()
                                            setPlay(`paused_${track}`)
                                        }}
                                    >
                                        <i className="las la-pause"></i>
                                    </div>
                                ) : play.replace('loading_', '') === track ? (
                                    <div
                                        className="cg-loader"
                                        onClick={() => {
                                            audioPlayerStart(track, music[track], index)
                                        }}
                                    ></div>
                                ) : (
                                    <div
                                        className="play-button"
                                        onClick={() => {
                                            audioPlayerStart(track, music[track], index)
                                        }}
                                    >
                                        <i className="las la-play"></i>
                                    </div>
                                )}
                                <audio
                                    src={music[track] ?? undefined}
                                    preload="none"
                                ></audio>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="cg-mask">
                {Array(15)
                    .fill(true)
                    .map((_, index) => {
                        const render = { mask: mask }
                        if (index % 2 !== 0) render.mask = mask.reverse()
                        render.mask = render.mask
                            .slice(0, holes[index][0])
                            .concat(Array(1).fill(' '))
                            .concat(render.mask.slice(holes[index][1]))
                        return (
                            <div key={index}>
                                <span>{render.mask.join('').split(' ')[0]}</span>
                                <span>{render.mask.join('').split(' ')[1]}</span>
                            </div>
                        )
                    })}
                <img
                    id="ai"
                    src={assistant}
                    alt="ai"
                ></img>
            </div>
            <div className={`cg-overlay ${modal === 'login' ? 'show' : ''}`}>
                <div className="cg-modal">
                    <div
                        className="cg-cross"
                        onClick={() => {
                            setModal(null)
                        }}
                    >
                        <i className="las la-times"></i>
                    </div>
                    <div className="cg-content cg-form">
                        <h1 className="form-title">LOGIN</h1>
                        <input
                            id="login_email"
                            placeholder="EMAIL"
                        ></input>
                        <input
                            id="login_password"
                            placeholder="PASSWORD"
                        ></input>
                        <button
                            className="cg-button"
                            style={{
                                margin: '1rem',
                                width: '-webkit-fill-available'
                            }}
                            onClick={() => {
                                setUser(true)
                                setModal(null)
                            }}
                        >
                            SUBMIT DATA<pre>{mask.join('')}</pre>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`cg-overlay ${modal === 'characters' ? 'show' : ''}`}>
                <div className="cg-modal characters">
                    <div
                        className="cg-cross"
                        onClick={() => {
                            setModal(null)
                        }}
                    >
                        <i className="las la-times"></i>
                        <p>CHARACTERS</p>
                    </div>
                    <div className="cg-content cg-form characters">
                        {Object.entries(characters).map((characterData) => (
                            <button
                                key={characterData[0]}
                                className={`characters cg-button ${character === characterData[0] ? 'active' : ''}`}
                                onClick={() => {
                                    setCharacter(characterData[0])
                                }}
                            >
                                {characterData[0].toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`cg-overlay ${modal === 'chat' ? 'show' : ''}`}>
                <div className="cg-chat">
                    <div
                        className="cg-cross"
                        onClick={() => {
                            setModal(null)
                        }}
                    >
                        <i className="las la-times"></i>
                        <p>{character?.toUpperCase()}</p>
                    </div>
                    <div className="cg-messages">
                        {messages.length === 0 && (
                            <div className="cg-message from">No one message here yet. May you try send some?</div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`cg-message ${message.from === 'User' ? 'to' : 'from'}`}
                            >
                                {message.message}
                            </div>
                        ))}
                        <div
                            id="scroll"
                            style={{ height: 0, width: 0 }}
                        ></div>
                    </div>
                    <div className="cg-form">
                        <textarea
                            id="chat_message"
                            placeholder="MESSAGE"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement
                                if (target.value.includes('\n')) {
                                    if (target.value.length > 1) {
                                        sendMessage()
                                        target.value = ''
                                    } else target.value = target.value.replace('\n', '')
                                } else {
                                    setCurrentMessage(target.value)
                                }
                                const canvas = document.getElementById('canvas') as HTMLCanvasElement
                                const ctx = canvas?.getContext('2d')
                                e.currentTarget.style.height = `${Math.floor(Number(ctx?.measureText(e.currentTarget.value).width) / 205) * 1 + 2}rem`
                            }}
                        ></textarea>
                        <canvas
                            className="d-none h-0 w-0"
                            id="canvas"
                        ></canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}
