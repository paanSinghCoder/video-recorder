'use client'
import Navbar from './components/Navbar'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
	const [isPermissionGranted, setPermissionGranted] = useState<any>(true)
	const videoRef = useRef(null)

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(
			mediaStream => {
				setPermissionGranted(true)
				let video: any = videoRef.current
				video.srcObject = mediaStream
				video.addEventListener('loadedmetadata', () => {
					video.play()
				})
			},
			e => {
				setPermissionGranted(false)
			}
		)
	}, [])

	return (
		<main className="w-screen h-screen">
			<div className="border-b">
				<Navbar />
			</div>
			<div className="flex items-center justify-center pt-12">
				<div className="flex flex-col items-center justify-center">
					{!isPermissionGranted && (
						<div className="text-red-700 font-bold text-xl">
							Please grant audio / video permission and reload.
						</div>
					)}
					<div className="">
						<video className="h-full w-[890px] rounded-lg" ref={videoRef}></video>
					</div>
					<div className="border rounded-3xl px-16 py-2 mt-10">
						<img src="/record.png" alt="record" className="h-12 w-auto cursor-pointer" />
					</div>
				</div>
			</div>
		</main>
	)
}
