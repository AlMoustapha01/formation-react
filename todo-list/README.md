# 📝 Atelier Pratique - Todo List React

## Formation React.js - Séance 1

### CNSS Bénin • 15 Décembre 2025

---

## 🎯 Objectifs de l'atelier

Créer une application Todo List complète en utilisant les concepts appris :

- **useState** pour gérer l'état local
- **Props** pour passer des données aux composants enfants
- **.map()** pour afficher des listes dynamiques
- **Keys** pour optimiser le rendu des listes
- **Événements** (onChange, onClick, onKeyPress)

---

## 🚀 Démarrage rapide

### 1. Créer un nouveau projet React avec Vite

```bash
npm create vite@latest todo-list -- --template react
cd todo-list
npm install
npm run dev
```

### 2. Remplacer le contenu des fichiers

- Remplacez `src/App.jsx` avec le code fourni dans `TodoList_Atelier_Seance1.jsx`
- Remplacez `src/App.css` avec le contenu de `TodoList_App.css`

### 3. Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

---

## 📁 Structure du projet

```
todo-list/
├── src/
│   ├── App.jsx          # Composant principal
│   ├── App.css          # Styles
│   └── main.jsx         # Point d'entrée
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔧 Fonctionnalités implémentées

| Fonctionnalité         | Concept React utilisé   |
| ---------------------- | ----------------------- |
| Ajouter une tâche      | useState, événements    |
| Marquer comme terminée | useState, immutabilité  |
| Supprimer une tâche    | useState, filter()      |
| Afficher la liste      | .map(), keys            |
| Compteur de tâches     | Calcul dérivé de l'état |

---

## 📚 Concepts clés expliqués

### 1. useState - Gestion de l'état

```jsx
// État pour la liste des tâches
const [todos, setTodos] = useState([]);

// État pour le champ de saisie
const [inputValue, setInputValue] = useState("");
```

### 2. Immutabilité - Ne jamais modifier directement l'état

```jsx
// ❌ MAUVAIS - Mutation directe
todos.push(newTodo);

// ✅ BON - Créer un nouveau tableau
setTodos([...todos, newTodo]);
```

### 3. Props - Communication parent → enfant

```jsx
// Parent passe les props
<TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />;

// Enfant reçoit les props
function TodoItem({ todo, onToggle, onDelete }) {
  // Utilisation des props
}
```

### 4. Keys - Identification unique des éléments

```jsx
// ✅ BON - Utiliser un ID unique
{
  todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);
}

// ❌ MAUVAIS - Utiliser l'index
{
  todos.map((todo, index) => <TodoItem key={index} todo={todo} />);
}
```

---

## 🏋️ Exercices supplémentaires

### Niveau 1 - Facile

1. Ajouter un bouton "Tout effacer"
2. Afficher la date de création de chaque tâche

### Niveau 2 - Intermédiaire

3. Ajouter des filtres (Toutes / Actives / Terminées)
4. Permettre la modification d'une tâche existante

### Niveau 3 - Avancé

5. Sauvegarder les tâches dans le localStorage
6. Ajouter un drag & drop pour réorganiser les tâches

---

## 💡 Solutions des exercices

### Exercice 1 - Bouton "Tout effacer"

```jsx
const clearAll = () => {
  setTodos([]);
};

<button onClick={clearAll}>Tout effacer</button>;
```

### Exercice 3 - Filtres

```jsx
const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

const filteredTodos = todos.filter(todo => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});

// Boutons de filtre
<button onClick={() => setFilter('all')}>Toutes</button>
<button onClick={() => setFilter('active')}>Actives</button>
<button onClick={() => setFilter('completed')}>Terminées</button>
```

### Exercice 5 - localStorage

```jsx
// Charger au démarrage
const [todos, setTodos] = useState(() => {
  const saved = localStorage.getItem("todos");
  return saved ? JSON.parse(saved) : [];
});

// Sauvegarder à chaque changement
useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);
```

---

## ✅ Checklist de validation

- [ ] L'application s'affiche correctement
- [ ] Je peux ajouter une nouvelle tâche
- [ ] Je peux marquer une tâche comme terminée
- [ ] Je peux supprimer une tâche
- [ ] Le compteur se met à jour
- [ ] La touche Entrée permet d'ajouter une tâche
- [ ] Les tâches terminées ont un style barré

---

## 🎉 Félicitations !

Vous avez créé votre première application React complète !

**Prochaine étape :** Séance 2 - Gestion de l'état avec Context API et Redux
