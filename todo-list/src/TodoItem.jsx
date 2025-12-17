// --------------------------------------------
// Composant TodoItem (Élément de liste)
// --------------------------------------------

export function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {/* Checkbox pour marquer comme terminé */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />

      {/* Texte de la tâche */}
      <span className="todo-text">{todo.text}</span>

      {/* Bouton de suppression */}
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-button"
      >
        ✕
      </button>
    </li>
  );
}