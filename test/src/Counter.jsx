import React, { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
    const [email, setEmail] = useState("test@gmail.com");
    const [showEmail, setShowEmail] = useState(false);

    const increment = () => {
        setCount((prevCount) => prevCount + 1);
    }

    const decrement = () => {
        setCount((prevCount) => prevCount - 1);
    }

    const reset = () => {
        setCount(0);
    }

    const ToggleShowEmail = () => {
        setShowEmail(!showEmail);
    }

    return (
        <div>
            <div>
                <h1>{count}</h1>
                <button onClick={increment}>Increment</button>
                <button onClick={decrement}>Decrement</button>
                <button onClick={reset}>Reset</button>
            </div>
            <div>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={ToggleShowEmail}>{showEmail ? "Hide Email" : "Show Email"}</button>
            </div>
            {
                showEmail && <p>{email}</p>
            }
           


        </div>
    )

}