export function Welcome() {
    const name = "Marie";
    const isLoggedIn = true;

    return (
        <div className="container">
            <h1>Bonjour {name} !</h1>
            {
            isLoggedIn ? <p>Binvenue sur React</p> : <p>Aurevoir Monsieur</p>}
            <img src="logo.png" alt="Logo" />
        </div>
    )
}