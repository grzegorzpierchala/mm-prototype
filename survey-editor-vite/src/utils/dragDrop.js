// Drag and Drop functionality for survey questions
export function initDragDrop() {
  let draggedElement = null;
  let draggedIndex = null;
  let placeholder = null;

  return {
    isDragging: false,
    draggedQuestionId: null,
    
    // Initialize drag and drop for a question
    initQuestionDrag(el, questionId, index) {
      el.draggable = true;
      
      el.addEventListener('dragstart', (e) => {
        // Only allow dragging from the drag handle
        if (!e.target.closest('.block-handle')) {
          e.preventDefault();
          return;
        }
        
        this.isDragging = true;
        this.draggedQuestionId = questionId;
        draggedElement = el;
        draggedIndex = index;
        
        // Add dragging class
        el.classList.add('opacity-50');
        
        // Create placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'h-24 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg mb-4 transition-all';
        placeholder.style.display = 'none';
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', el.innerHTML);
      });
      
      el.addEventListener('dragend', (e) => {
        this.isDragging = false;
        this.draggedQuestionId = null;
        
        // Remove dragging class
        el.classList.remove('opacity-50');
        
        // Remove placeholder
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
        
        draggedElement = null;
        draggedIndex = null;
      });
      
      el.addEventListener('dragover', (e) => {
        if (!draggedElement || draggedElement === el) return;
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = getDragAfterElement(el.parentNode, e.clientY);
        
        if (!placeholder.parentNode) {
          el.parentNode.insertBefore(placeholder, afterElement);
        } else if (afterElement == null) {
          el.parentNode.appendChild(placeholder);
        } else {
          el.parentNode.insertBefore(placeholder, afterElement);
        }
        
        placeholder.style.display = 'block';
      });
      
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        
        if (!draggedElement || !placeholder) return;
        
        const questions = Alpine.store('survey').questions;
        const fromIndex = draggedIndex;
        const toIndex = [...el.parentNode.children].indexOf(placeholder);
        
        if (fromIndex !== toIndex && toIndex !== -1) {
          // Reorder questions in the store
          const [movedQuestion] = questions.splice(fromIndex, 1);
          questions.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, movedQuestion);
          
          // Trigger autosave
          Alpine.store('ui').debouncedAutoSave();
        }
      });
    },
    
    // Initialize drag and drop for options within a question
    initOptionDrag(el, questionId, optionId, optionIndex) {
      const handle = el.querySelector('.option-drag-handle');
      if (!handle) return;
      
      handle.addEventListener('mousedown', () => {
        el.draggable = true;
      });
      
      el.addEventListener('dragstart', (e) => {
        if (!el.draggable) {
          e.preventDefault();
          return;
        }
        
        el.classList.add('opacity-50');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('questionId', questionId);
        e.dataTransfer.setData('optionId', optionId);
        e.dataTransfer.setData('optionIndex', optionIndex.toString());
      });
      
      el.addEventListener('dragend', () => {
        el.classList.remove('opacity-50');
        el.draggable = false;
      });
      
      el.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const draggingOptionId = e.dataTransfer.getData('optionId');
        if (!draggingOptionId || draggingOptionId === optionId) return;
        
        const rect = el.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        if (y < height / 2) {
          el.classList.add('border-t-2', 'border-indigo-500');
          el.classList.remove('border-b-2');
        } else {
          el.classList.add('border-b-2', 'border-indigo-500');
          el.classList.remove('border-t-2');
        }
      });
      
      el.addEventListener('dragleave', () => {
        el.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
      });
      
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
        
        const draggedQuestionId = e.dataTransfer.getData('questionId');
        const draggedOptionId = e.dataTransfer.getData('optionId');
        const draggedOptionIndex = parseInt(e.dataTransfer.getData('optionIndex'));
        
        if (draggedQuestionId !== questionId || draggedOptionId === optionId) return;
        
        const question = Alpine.store('survey').questions.find(q => q.id === questionId);
        if (!question) return;
        
        const rect = el.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        const insertBefore = y < height / 2;
        
        // Find the target option index
        const targetIndex = question.options.findIndex(o => o.id === optionId);
        
        // Reorder options
        const [movedOption] = question.options.splice(draggedOptionIndex, 1);
        const newIndex = insertBefore ? targetIndex : targetIndex + 1;
        const adjustedIndex = draggedOptionIndex < targetIndex ? newIndex - 1 : newIndex;
        question.options.splice(adjustedIndex, 0, movedOption);
        
        // Trigger autosave
        Alpine.store('ui').debouncedAutoSave();
      });
    }
  };
}

// Helper function to get the element after which the dragged element should be inserted
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.block:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}