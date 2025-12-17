import { useState, useEffect } from "react"

// Exemple 1: useEffect avec tableau vide (exécuté une seule fois)
export function Timer() {
  const [seconds, setSeconds] = useState(0)

  // useEffect s'exécute après le rendu du composant
  useEffect(() => {
    // Code exécuté au montage et à chaque mise à jour de "seconds"
    console.log("Le composant a été rendu, secondes:", seconds)

    // Création d'un intervalle qui incrémente toutes les secondes
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    // Fonction de nettoyage (cleanup) - exécutée au démontage
    return () => {
      console.log("Nettoyage: suppression de l'intervalle")
      clearInterval(intervalId)
    }
  }, []) // [] = tableau de dépendances vide = exécuté uniquement au montage

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h2>⏱️ Timer avec useEffect</h2>
      <p>Temps écoulé: <strong>{seconds}</strong> secondes</p>
    </div>
  )
}

// Exemple 2: useEffect avec dépendances (exécuté quand les dépendances changent)
export function WindowSize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  // Ce useEffect se déclenche au montage et écoute les changements de taille
  useEffect(() => {
    // Fonction appelée quand la fenêtre est redimensionnée
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    // Abonnement à l'événement resize
    window.addEventListener("resize", handleResize)
    console.log("Abonnement à l'événement resize")

    // Cleanup: désabonnement au démontage
    return () => {
      window.removeEventListener("resize", handleResize)
      console.log("Désabonnement de l'événement resize")
    }
  }, []) // [] = une seule fois au montage

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h2>📐 Taille de la fenêtre</h2>
      <p>Largeur: <strong>{windowWidth}px</strong></p>
      <p>Hauteur: <strong>{windowHeight}px</strong></p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Redimensionnez la fenêtre pour voir les valeurs changer !
      </p>
    </div>
  )
}

// Exemple 3: useEffect avec dépendances dynamiques
export function Counter2() {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(2)

  // Calcul dérivé (pas besoin de state séparé)
  const result = count * multiplier

  // Ce useEffect se déclenche quand count OU multiplier change
  // Utilisé pour un effet de bord EXTERNE (document.title)
  useEffect(() => {
    console.log(`Calcul: ${count} x ${multiplier} = ${result}`)
    document.title = `Résultat: ${result}`
  }, [count, multiplier]) // <-- Dépendances multiples

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", margin: "10px" }}>
      <h2>🔢 Calcul avec dépendances multiples</h2>
      <div>
        <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
        <button onClick={() => setMultiplier(m => m + 1)} style={{ marginLeft: "10px" }}>
          Multiplier: {multiplier}
        </button>
      </div>
      <p style={{ marginTop: "10px" }}>
        {count} × {multiplier} = <strong>{result}</strong>
      </p>
    </div>
  )
}
