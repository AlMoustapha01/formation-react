// ============================================
// ATELIER PRATIQUE - SÉANCE 1
// Application Todo List avec React
// ============================================

// Ce fichier contient tout le code nécessaire pour créer
// une application Todo List complète en React.
// Concepts utilisés : useState, Props, .map(), Keys, Events

// --------------------------------------------
// FICHIER: App.jsx (Composant Principal)
// --------------------------------------------

import { useState } from 'react';
import './App.css';
import {TodoItem} from './TodoItem';
import TodoIcon from "./assets/to-do-list.png"
function App() {
  // État pour stocker la liste des tâches
  const [todos, setTodos] = useState([
    { id: 1, text: 'Apprendre React', completed: false },
    { id: 2, text: 'Créer une Todo List', completed: true },
    { id: 3, text: 'Maîtriser les Hooks', completed: false },
  ]);

  // État pour le champ de saisie
  const [inputValue, setInputValue] = useState('');

  // Fonction pour ajouter une nouvelle tâche
  const addTodo = () => {
    // Vérifier que le champ n'est pas vide
    if (inputValue.trim() === '') return;

    // Créer une nouvelle tâche avec un ID unique
    const newTodo = {
      id: Date.now(), // ID unique basé sur le timestamp
      text: inputValue.trim(),
      completed: false,
    };

    // Ajouter la nouvelle tâche à la liste (immutabilité)
    setTodos([...todos, newTodo]);

    // Réinitialiser le champ de saisie
    setInputValue('');
  };

  // Fonction pour basculer l'état completed d'une tâche
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Fonction pour supprimer une tâche
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Gestion de la touche Entrée pour ajouter une tâche
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Calcul du nombre de tâches restantes
  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="app">
      <div className='title'>
        <img style={{width:50,height:50}} src={TodoIcon} alt="" />
        <h1> Ma Todo List</h1>
      </div>

      {/* Zone de saisie */}
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ajouter une nouvelle tâche..."
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>

      {/* Compteur de tâches */}
      <p className="counter">
        {remainingTodos} tâche{remainingTodos !== 1 ? 's' : ''} restante
        {remainingTodos !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default App;