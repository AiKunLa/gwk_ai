"use client"

import { useRef, useState } from "react"

export default function About() {

    const [name, setName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const handelSubmit = () => {
        console.log(inputRef.current?.value)
    }
    return (
        <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-2xl font-bold">About</h1>
            <label htmlFor="name">Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} />
            <button disabled={!name} onClick={() => console.log(name)}>Get Name</button>
            <br />

            <label htmlFor="age">Age:</label>
            <input
                type="text"
                defaultValue="18"
                ref={inputRef}
            />
            <button onClick={handelSubmit}>submit</button>
        </div>
    )
}