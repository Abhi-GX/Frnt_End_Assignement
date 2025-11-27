import React, { useState, useEffect } from 'react';
import './ListPage.css';

const ListPage = ({focus}) => {
  console.log(focus);
  // states
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('tasks');
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed && Array.isArray(parsed) ? parsed : [{ id: 1, text: 'Sample Task',scheduled: Date.now(), done: false }];
    
    } catch (e) {
      return [{ id: 1, text: 'Sample Task', done: false }];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [notes, setNotes] = useState(() => {
    try {
      return localStorage.getItem('notes') || 'Building the ideas that are never meant to be built.';
    } catch (e) {
      return '';
    }
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalScheduled, setModalScheduled] = useState('');
  const [modalCategory, setModalCategory] = useState('personal');

  

  const categoryIcon = (cat) => {
    const map = {
      work: '💼',
      personal: '🏠',
      shopping: '🛒',
      study: '📚',
      others: '🔖',
    };
    return map[cat] || '🔖';
  };

  // CRUD operations

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    
    setModalScheduled('');
    setModalCategory('personal');
    setShowAddModal(true);
  };

  const confirmAddTask = () => {
    const text = input.trim();
    if (!text) { setShowAddModal(false); return; }
    const newTask = {
      id: Date.now(),
      text,
      done: false,
      scheduled: modalScheduled || null,
      category: modalCategory || 'personal',
    };
    setTasks(prev => [newTask, ...prev]);
    setInput('');
    setShowAddModal(false);
  };

  const toggleDone = (id) => {
    console.log(id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    console.log("toggle :",tasks);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('notes', notes);
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [notes]);


  //filtering , need some logic changes
  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'completed') return t.done;
    if (filter === 'pending') return !t.done;
    if (filter === 'upcoming') {
      if (!t.scheduled) return false;
      const when = new Date(t.scheduled);
      return when > new Date() && !t.done;
    }
    if (filter === 'overdue') {
      if (!t.scheduled) return false;
      const when = new Date(t.scheduled);
      return when < new Date() && !t.done;
    }
    return !t.done;
  });

  return (
    <div className="listpage container">
      <h2 className="lp-title">Your Tasks</h2>

      <div className="lp-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          type="text"
          placeholder="Enter a task..."
          className="lp-input"
        />
        <button className="lp-add" onClick={addTask}>Add</button>
      </div>

      <div className="lp-actions">
        <div className="lp-filters">
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Completed</button>
          <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'active' : ''}>Pending</button>
          <button onClick={() => setFilter('upcoming')} className={filter === 'upcoming' ? 'active' : ''}>Upcoming</button>
          <button onClick={() => setFilter('overdue')} className={filter === 'overdue' ? 'active' : ''}>Overdue</button>
        </div>
      </div>

     
      <table className="task-table">
        <colgroup>
          <col style={{ width: '48px' }} />
          <col />
          <col style={{ width: '140px' }} />
          <col style={{ width: '120px' }} />
          <col style={{ width: '140px' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{width: '48px'}}>#</th>
            <th >Task</th>
            <th style={{width: '140px'}}>Status</th>
            <th style={{width: '120px'}}>Category</th>
            <th style={{width: '140px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t, i) => (
            <tr key={t.id} className={t.done ? 'done' : ''}>
              <td>{i + 1}</td>
              <td className="task-cell-task">
                <div className="task-main">
                  <div className="task-title">{t.text}</div>
                  <div className="task-scheduled-small">{t.scheduled ? new Date(t.scheduled).toLocaleString() : ''}</div>
                </div>
              </td>

              <td className="task-cell-status">{t.done ? 'Completed' : 'Pending'}</td>
              
              <td>{categoryIcon(t.category)} <span className="cat-label">{t.category}</span></td>
              <td className="task-cell-actions" >
                <button onClick={() => toggleDone(t.id)} className="btn-done">{t.done ? 'Undo' : 'Done'}</button>
                <button onClick={() => deleteTask(t.id)} className="btn-delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* mobile- view is written seperatly as i want different UI */}
      <div className="task-list">
        {filtered.map((t, i) => (
          <div key={t.id} className={`task-card ${t.done ? 'done' : ''}`}>
            <div className="task-header">
              <div className="task-index">{i + 1}</div>
              <div className="task-text">{t.text}</div>
            </div>
            <div className="task-meta">
              <div className="task-left">
                <div className="task-status">{t.done ? 'Completed' : 'Pending'}</div>
                <div className="task-scheduled">{t.scheduled ? new Date(t.scheduled).toLocaleString() : 'No schedule'}</div>
              </div>
              <div className="task-controls">
                <div className="task-category">{categoryIcon(t.category)} <span className="visually-hidden">{t.category}</span></div>
                <div className="task-buttons">
                  <button onClick={() => toggleDone(t.id)} className="btn-done">{t.done ? 'Undo' : 'Done'}</button>
                  <button onClick={() => deleteTask(t.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lp-notes">
        <h3>Notes</h3>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes..." rows={4}></textarea>
      </div>

      {showAddModal && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add task details</h3>
            <div className="modal-row">
              <label>Scheduled</label>
              <input type="datetime-local" value={modalScheduled} onChange={e => setModalScheduled(e.target.value)} />
            </div>

            <div className="modal-row">
              <label>Category</label>
              <div className="category-list">
                <button type="button" className={modalCategory === 'personal' ? 'cat active' : 'cat'} onClick={() => setModalCategory('personal')}>🏠<span>Personal</span></button>
                <button type="button" className={modalCategory === 'work' ? 'cat active' : 'cat'} onClick={() => setModalCategory('work')}>💼<span>Work</span></button>
                <button type="button" className={modalCategory === 'shopping' ? 'cat active' : 'cat'} onClick={() => setModalCategory('shopping')}>🛒<span>Shopping</span></button>
                <button type="button" className={modalCategory === 'study' ? 'cat active' : 'cat'} onClick={() => setModalCategory('study')}>📚<span>Study</span></button>
                <button type="button" className={modalCategory === 'others' ? 'cat active' : 'cat'} onClick={() => setModalCategory('others')}>🔖<span>Other</span></button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmAddTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPage;