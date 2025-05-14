import './main.css'
import { useState, useEffect, useRef } from 'preact/hooks'
import Peppermeet from '../../icons/peppermeet'

export default function Home() {
    const [messages, setMessages] = useState<{ message: string; emoji?: string }[]>([])
    const [currentMessage, setCurrentMessage] = useState('')
    const [stream, setStream] = useState<any | undefined>(undefined)
    const [shareScreen, setShareScreen] = useState<any | undefined>(undefined)
    const [broadcast, setBroadcast] = useState<true | undefined>(undefined)
    const [webcam, setWebcam] = useState(true)
    const [mic, setMic] = useState(true)
    const [mute, setMute] = useState(false)
    const [broadcastID, setBroadcastID] = useState<string | undefined>(undefined)

    const video = useRef<HTMLVideoElement>(null)
    const audio = useRef<HTMLAudioElement>(null)
    const display = useRef<HTMLVideoElement>(null)

    const emojiList = [
        'face',
        'face_2',
        'face_3',
        'face_4',
        'face_5',
        'face_6',
        'raven',
        'mood',
        'mood_bad',
        'sick',
        'sentiment_calm',
        'sentiment_excited',
        'sentiment_satisfied',
        'sentiment_dissatisfied',
        'sentiment_very_satisfied',
        'sentiment_neutral',
        'sentiment_very_dissatisfied',
        'sentiment_extremely_dissatisfied',
        'sentiment_sad',
        'sentiment_stressed',
        'sentiment_content',
        'sentiment_frustrated',
        'sentiment_worried',
        'skull',
        'flutter_dash',
        'panorama_photosphere',
        'domino_mask',
        'smart_outlet',
        'outlet',
        'cruelty_free'
    ]

    function startBroadcast() {
        setBroadcast(true)
        setCurrentMessage('')
        setMessages([])
        setShareScreen(undefined)
        setWebcam(true)
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(function (streamData) {
                video!.current!.srcObject = streamData
                video!.current!.play()
                setStream(streamData)
            })
            .catch(function () {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (streamData) {
                    audio!.current!.srcObject = streamData
                    audio!.current!.play()
                    setStream(streamData)
                })
            })
    }

    function startShareScreen() {
        if (shareScreen != null) {
            stopShareScreen()
        } else {
            navigator.mediaDevices.getDisplayMedia({ audio: true }).then(async function (displayStream) {
                display!.current!.srcObject = displayStream
                display!.current!.play()
                setShareScreen(displayStream)
            })
        }
    }

    function stopShareScreen() {
        shareScreen.getTracks().forEach(function (track: any) {
            track.stop()
        })
        display!.current!.srcObject = null
        setShareScreen(undefined)
    }

    function stopBroadcast() {
        video!.current!.srcObject = null
        display!.current!.srcObject = null
        stream.getTracks().forEach(function (track: any) {
            track.stop()
        })
        if (shareScreen) stopShareScreen()
        setBroadcast(undefined)
    }

    function sendMessage() {
        if (currentMessage.length > 0) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: currentMessage, emoji: emojiList[Math.floor(Math.random() * (emojiList.length - 0.001))] }
            ])
            setCurrentMessage('')
        }
    }

    useEffect(() => {
        if (broadcast != null) {
            if (!webcam) {
                video!.current!.srcObject = null
                if (stream != null) {
                    audio!.current!.srcObject = stream
                    audio!.current!.play()
                    audio!.current!.muted = !mic
                }
            } else {
                audio!.current!.srcObject = null
                if (stream != null) {
                    video!.current!.srcObject = stream
                    video!.current!.play()
                    video!.current!.muted = !mic
                }
            }
        }
    }, [webcam])

    useEffect(() => {
        if (broadcast != null) {
            if (!webcam) {
                audio!.current!.muted = !mic
            } else {
                video!.current!.muted = !mic
            }
        }
    }, [mic])

    useEffect(() => {
        if (broadcast != null) {
            audio!.current!.muted = mute
            video!.current!.muted = mute
            display!.current!.muted = mute
        }
    }, [mute])

    return (
        <main id="app-root">
            {broadcast ? (
                <div className="max-sm:translate-3d-0 flex select-none flex-row overflow-hidden max-sm:h-screen max-sm:flex-col">
                    <video
                        playsInline
                        src="/peppermeet/placeholder.mp4"
                        autoPlay
                        muted
                        loop
                        className="fixed bottom-0 right-0 z-[-1] min-h-screen min-w-max blur-2xl brightness-125 contrast-200 saturate-50"
                    />
                    <div className="h-screen w-[80%] bg-black p-2 pt-[3.8rem] max-sm:h-auto max-sm:w-full">
                        <div className="relative flex flex-col">
                            <video
                                playsInline
                                ref={display}
                                autoPlay
                                className="z-40 aspect-video w-full rounded-xl"
                            />
                            <div className="pm-block absolute right-0 top-0 z-30 aspect-video w-full rounded-xl"></div>
                            <video
                                playsInline
                                src="/peppermeet/placeholder.mp4"
                                autoPlay
                                muted
                                loop
                                className="absolute right-0 top-0 z-20 h-full w-full rounded-xl brightness-125 contrast-200 saturate-50"
                            />
                            <div
                                id="webcam"
                                className={`pm-block absolute bottom-0 left-0 z-50 h-auto w-[200px] rounded-bl-xl rounded-tr-xl max-sm:w-[100px] ${!webcam ? 'opacity-0' : ''}`}
                            >
                                <video
                                    playsInline
                                    ref={video}
                                    autoPlay
                                    className="pm-camera h-auto w-[200px] rounded-br-xl rounded-tl-xl max-sm:w-[100px]"
                                />
                                <audio
                                    // @ts-expect-error audio tag playsInline preact no compatibility
                                    playsInline
                                    ref={audio}
                                    autoPlay
                                    className="!m-0 !h-0 !w-0 !p-0"
                                />
                            </div>
                            <div className="pm-block absolute right-0 top-0 z-[60] w-full rounded-t-xl">
                                <div className="flex w-full flex-row">
                                    <div className="me-auto flex flex-row">
                                        <div className="pm-icon select-text flex-row max-sm:!p-2">
                                            <span className="material-symbols-outlined me-2 max-sm:!text-[16px]">
                                                fingerprint
                                            </span>
                                            <p className="max-sm:!text-[10px] max-sm:!leading-[16px]">
                                                {broadcastID ?? '6ys53o2a1'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <button
                                            className={`pm-icon max-sm:!p-2 ${webcam ? 'record' : ''}`}
                                            onClick={() => {
                                                setWebcam(!webcam)
                                            }}
                                        >
                                            <span className="material-symbols-outlined max-sm:!text-[16px]">
                                                camera_video
                                            </span>
                                        </button>
                                        <button
                                            className={`pm-icon max-sm:!p-2 ${mic ? 'record' : ''}`}
                                            onClick={() => {
                                                setMic(!mic)
                                            }}
                                        >
                                            <span className="material-symbols-outlined max-sm:!text-[16px]">mic</span>
                                        </button>
                                        <button
                                            className="pm-icon max-sm:!p-2"
                                            onClick={() => {
                                                setMute(!mute)
                                            }}
                                        >
                                            <span className="material-symbols-outlined">
                                                {mute ? 'volume_off' : 'volume_up'}
                                            </span>
                                        </button>
                                        <button
                                            className={`pm-icon max-sm:!p-2 ${shareScreen != null ? 'record' : ''}`}
                                            onClick={startShareScreen}
                                        >
                                            <span className="material-symbols-outlined max-sm:!text-[16px]">
                                                screen_record
                                            </span>
                                        </button>
                                        <button
                                            className="pm-icon max-sm:!p-2"
                                            onClick={stopBroadcast}
                                        >
                                            <span className="material-symbols-outlined max-sm:!text-[16px]">
                                                stop_circle
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pm-logo absolute right-0 top-0 flex h-screen w-[20%] flex-col bg-black p-2 pl-0 pt-[3.8rem] max-sm:relative max-sm:h-full max-sm:w-full max-sm:py-0 max-sm:pl-2">
                        <div className="flex h-full flex-col overflow-y-scroll rounded-xl border-2 pt-2">
                            <div className="mt-auto flex flex-col">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full flex-row"
                                    >
                                        <span className="material-symbols-outlined mb-auto ml-2 mt-2">
                                            {message.emoji ?? 'support_agent'}
                                        </span>
                                        <p className="pm-message !mt-0 break-words break-all !p-2 !px-3 !text-sm">
                                            {message.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full flex-row rounded-b-xl">
                            <textarea
                                className="pm-input !mx-0 !border-white !p-2 !px-3 !text-sm"
                                style={{ height: '2.5rem' }}
                                value={currentMessage}
                                placeholder="Write a message"
                                onChange={(e) => setCurrentMessage((e.target as HTMLInputElement).value)}
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
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-sm:translate-3d-0 flex h-screen w-screen select-none flex-col items-center justify-center overflow-hidden text-center">
                    <div className="overflow-hidden">
                        <video
                            playsInline
                            src="/peppermeet/placeholder.mp4"
                            autoPlay
                            muted
                            loop
                            className="fixed left-0 top-0 z-0 min-h-screen min-w-max blur-2xl brightness-125 contrast-200 saturate-50"
                        />
                    </div>
                    <div className="pm-logo absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-black">
                        <div className="my-8 flex flex-row">
                            <div className="mr-4 h-[100px] w-[100px] max-sm:h-[50px] max-sm:w-[50px]">
                                <Peppermeet />
                            </div>
                            <h1 className="text-[66px] font-extrabold max-sm:text-[33px]">Peppermeet</h1>
                        </div>
                        <h1 className="mx-4 my-8 max-w-[450px] text-4xl font-medium max-sm:text-2xl">
                            Easy, fast and secure meetings for your co-op game-sessions
                        </h1>
                        <div className="mt-4 flex max-w-[300px] flex-col">
                            <button
                                id="start_broadcast"
                                className="pm-button mx-auto !justify-center"
                                onClick={startBroadcast}
                            >
                                Start Meeting
                            </button>
                            <p className="my-2">OR</p>
                            <input
                                className="pm-input"
                                type="text"
                                value={broadcastID}
                                placeholder="Set Meeting ID"
                                onChange={(e) => setBroadcastID((e.target as HTMLInputElement).value)}
                            />
                            <button
                                className="pm-button !justify-center"
                                onClick={startBroadcast}
                            >
                                Connect to Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
