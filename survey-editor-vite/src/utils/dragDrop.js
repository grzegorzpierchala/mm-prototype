// Drag and Drop functionality for survey questions
export function initDragDrop() {
  let draggedElement = null;
  let draggedIndex = null;
  let placeholder = null;
  let currentDragData = null;

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
      
      // Remove any existing listeners first
      const oldHandleClone = handle.cloneNode(true);
      handle.parentNode.replaceChild(oldHandleClone, handle);
      const newHandle = oldHandleClone;
      
      // Store the element reference for cleanup
      el._dragHandle = newHandle;
      el._cleanupDrag = null;
      
      // Make the entire option draggable, but only when dragging from handle
      el.draggable = false;
      
      // Store drag data on the element
      el.dataset.questionId = questionId;
      el.dataset.optionId = optionId;
      el.dataset.optionIndex = optionIndex;
      
      // Handle mousedown on drag handle
      newHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Enable dragging
        el.draggable = true;
        el.classList.add('cursor-grabbing');
        
        // Store current drag data
        currentDragData = {
          questionId: questionId,
          optionId: optionId,
          optionIndex: optionIndex,
          element: el
        };
        
        // Create cleanup function
        const cleanup = () => {
          if (el._cleanupDrag === cleanup) {
            el.draggable = false;
            el.classList.remove('cursor-grabbing', 'opacity-50', 'dragging');
            el._cleanupDrag = null;
            
            // Clean up all drop indicators
            document.querySelectorAll('.question-option').forEach(opt => {
              opt.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
            });
          }
          document.removeEventListener('mouseup', cleanup);
        };
        
        el._cleanupDrag = cleanup;
        document.addEventListener('mouseup', cleanup);
      });
      
      // Drag start
      el.addEventListener('dragstart', (e) => {
        if (!el.draggable || !currentDragData || currentDragData.element !== el) {
          e.preventDefault();
          return;
        }
        
        console.log('Option drag start:', currentDragData);
        
        // Add visual feedback
        el.classList.add('opacity-50', 'dragging');
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'dragging'); // Chrome requires some data
      });
      
      // Drag end
      el.addEventListener('dragend', (e) => {
        console.log('Drag end');
        
        // Clean up
        el.classList.remove('opacity-50', 'dragging', 'cursor-grabbing');
        el.draggable = false;
        
        // Clean up all drop indicators
        document.querySelectorAll('.question-option').forEach(opt => {
          opt.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
        });
        
        // Clear current drag data
        if (currentDragData && currentDragData.element === el) {
          currentDragData = null;
        }
        
        // Run cleanup if exists
        if (el._cleanupDrag) {
          el._cleanupDrag();
        }
      });
      
      // Drag over
      el.addEventListener('dragover', (e) => {
        if (!currentDragData || currentDragData.optionId === optionId || currentDragData.questionId !== questionId) {
          return;
        }
        
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Clear other indicators
        document.querySelectorAll('.question-option').forEach(opt => {
          if (opt !== el) {
            opt.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
          }
        });
        
        // Show drop indicator
        const rect = el.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isTopHalf = y < rect.height / 2;
        
        el.classList.toggle('border-t-2', isTopHalf);
        el.classList.toggle('border-b-2', !isTopHalf);
        el.classList.add('border-indigo-500');
      });
      
      // Drag leave
      el.addEventListener('dragleave', (e) => {
        // Only remove if truly leaving the element
        if (e.relatedTarget && !el.contains(e.relatedTarget)) {
          el.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
        }
      });
      
      // Drop
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Drop event, currentDragData:', currentDragData, 'target:', optionId);
        
        // Clean up visual indicators
        el.classList.remove('border-t-2', 'border-b-2', 'border-indigo-500');
        
        if (!currentDragData || currentDragData.questionId !== questionId || currentDragData.optionId === optionId) {
          return;
        }
        
        // Get the question from store
        const question = Alpine.store('survey').questions.find(q => q.id === questionId);
        if (!question || !question.options) return;
        
        // Calculate drop position
        const rect = el.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const insertBefore = y < rect.height / 2;
        
        // Find current indices
        const draggedIndex = question.options.findIndex(o => o.id === currentDragData.optionId);
        const targetIndex = question.options.findIndex(o => o.id === optionId);
        
        console.log('Reordering:', {
          draggedIndex,
          targetIndex,
          insertBefore,
          options: question.options.map(o => o.text)
        });
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Calculate new index
        let newIndex;
        if (draggedIndex < targetIndex) {
          newIndex = insertBefore ? targetIndex - 1 : targetIndex;
        } else {
          newIndex = insertBefore ? targetIndex : targetIndex + 1;
        }
        
        // Perform the reorder
        const [movedOption] = question.options.splice(draggedIndex, 1);
        question.options.splice(newIndex, 0, movedOption);
        
        console.log('Options after reorder:', question.options.map(o => o.text));
        
        // Trigger update
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