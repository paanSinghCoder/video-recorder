'use client'
import Navbar from './components/Navbar'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
	const [isPermissionGranted, setPermissionGranted] = useState<boolean>(true)
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [stream, setStream] = useState<any>(null)
	const [videoChunks, setVideoChunks] = useState<any>(null)
	const [video, setVideo] = useState<any>(null)
	const videoRef = useRef<any>(null)

	// Count timer
	const [isActive, setIsActive] = useState(false)
	const [seconds, setSeconds] = useState(0)

	useEffect(() => {
		let timer: any = null
		if (isActive) {
			timer = setInterval(() => {
				setSeconds(seconds => seconds + 1)
			}, 1000)
		}
		return () => {
			clearInterval(timer)
		}
	})

	useEffect(() => {
		if ('MediaRecorder' in window) {
			navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(
				mediaStream => {
					setPermissionGranted(true)
					let video: any = videoRef.current
					video.srcObject = mediaStream
					setStream(mediaStream)
					video.addEventListener('loadedmetadata', () => {
						video.play()
					})
				},
				e => {
					setPermissionGranted(false)
				}
			)
		} else {
			alert('Not supported.')
		}
	}, [])

	const startRecord = () => {
		setIsRecording(true)
		const media = new MediaRecorder(stream, { mimeType: 'video/webm' })
		videoRef.current = media
		videoRef.current.start()

		let videoRecChunks: any = []

		videoRef.current.ondataavailable = (event: any) => {
			if (typeof event.data === 'undefined') return
			if (event.data.size === 0) return
			videoRecChunks.push(event.data)
		}

		setVideoChunks(videoRecChunks)
	}

	const stopRecord = () => {
		setIsRecording(false)
		videoRef.current.stop()
		videoRef.current.onstop = () => {
			const videoBlob = new Blob(videoChunks, { type: 'video/webm' })
			const videoURL = URL.createObjectURL(videoBlob)
			setVideo(videoURL)
			console.log(videoURL)
		}
	}

	return (
		<main className="w-screen h-screen">
			<div className="border-b">
				<Navbar />
			</div>
			<div className="flex items-center justify-center pt-12">
				{!video ? (
					<div className="flex flex-col items-center justify-center">
						{!isPermissionGranted && (
							<div className="text-red-700 font-bold text-xl">
								Please grant audio / video permission and reload.
							</div>
						)}
						<div className="">
							<div className="w-full text-center text-xl pb-3 font-semibold opacity-80">
								Simple video recorder
							</div>
							<video className="h-full w-[890px] rounded-lg" ref={videoRef}></video>
						</div>
						<div className="border rounded-3xl px-8 py-2 mt-10 flex items-center justify-center">
							{isRecording ? (
								<>
									<div className="pr-4 opacity-60">Recording</div>
									<img
										onClick={() => stopRecord()}
										src="/stop.png"
										alt="stop"
										className="h-9 w-auto cursor-pointer"
									/>
									<div className="pl-4 opacity-60">00.00.{seconds}</div>
								</>
							) : (
								<img
									onClick={() => {
										startRecord()
										setIsActive(true)
									}}
									src="/record.png"
									alt="record"
									className="h-12 w-auto cursor-pointer"
								/>
							)}
						</div>
					</div>
				) : (
					<div className="border rounded-md p-12 w-[890px] h-auto">
						<div className="text-xl font-semibold mb-4">❤ Here is your awsome video...</div>
						<video src={video} className="h-auto w-full" controls></video>
						<div className="flex gap-4  items-center justify-center w-full p-7">
							<button
								className="border rounded-md shadow px-4 py-2"
								onClick={() => {
									// setPermissionGranted(true)
									// setVideo(null)
									window.location.reload()
								}}>
								🡠 Record another video
							</button>
							<a className="border rounded-md shadow px-4 py-2 font-bold" download href={video}>
								⬇ Download
							</a>
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
