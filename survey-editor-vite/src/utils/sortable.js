// Simple sortable implementation for options and questions
export function makeSortable(container, options = {}) {
  let draggedElement = null;
  let draggedIndex = null;
  let placeholder = null;
  let initialMousePos = { x: 0, y: 0 };
  let elementOffset = { x: 0, y: 0 };
  let lastValidTarget = null;
  let animationFrameId = null;
  let lastPlaceholderMove = 0;
  const PLACEHOLDER_THROTTLE = 50; // ms
  
  const {
    handle = '.option-drag-handle',
    draggableClass = 'question-option',
    onSort = () => {},
    axis = 'y' // only allow vertical dragging
  } = options;
  
  // Helper to get all sortable items
  function getItems() {
    return Array.from(container.querySelectorAll(`:scope > .${draggableClass}`));
  }
  
  // Helper to get item index
  function getItemIndex(item) {
    return getItems().indexOf(item);
  }
  
  // Create placeholder element
  function createPlaceholder(element) {
    const rect = element.getBoundingClientRect();
    const ph = document.createElement('div');
    ph.style.height = rect.height + 'px';
    ph.style.marginBottom = window.getComputedStyle(element).marginBottom;
    ph.className = 'sortable-placeholder bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-lg';
    ph.dataset.placeholder = 'true';
    return ph;
  }
  
  // Add/remove pointer events during drag
  function setPointerEvents(enabled) {
    const style = document.getElementById('sortable-pointer-events');
    if (!enabled) {
      if (!style) {
        const s = document.createElement('style');
        s.id = 'sortable-pointer-events';
        s.textContent = `
          .${draggableClass} * {
            pointer-events: none !important;
          }
          .sortable-placeholder {
            pointer-events: none !important;
          }
          body {
            user-select: none !important;
          }
        `;
        document.head.appendChild(s);
      }
    } else {
      if (style) {
        style.remove();
      }
    }
  }
  
  // Handle mouse down on handle
  function handleMouseDown(e) {
    const handle = e.target.closest(options.handle);
    if (!handle) return;
    
    const item = handle.closest(`.${draggableClass}`);
    if (!item || !container.contains(item)) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Store initial state
    draggedElement = item;
    draggedIndex = getItemIndex(item);
    initialMousePos = { x: e.clientX, y: e.clientY };
    
    const rect = item.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    
    // Calculate offset to maintain the element's position relative to mouse
    elementOffset = {
      x: e.clientX - rect.left, // Keep the horizontal offset where clicked
      y: e.clientY - rect.top   // Keep the vertical offset where clicked
    };
    
    // Create and insert placeholder
    placeholder = createPlaceholder(item);
    item.parentNode.insertBefore(placeholder, item.nextSibling);
    
    // Store original styles
    const computed = window.getComputedStyle(item);
    item._originalStyles = {
      position: item.style.position,
      zIndex: item.style.zIndex,
      width: item.style.width,
      opacity: item.style.opacity,
      cursor: item.style.cursor,
      left: item.style.left,
      top: item.style.top,
      transform: item.style.transform,
      pointerEvents: item.style.pointerEvents
    };
    
    // Style the dragged element
    item.style.position = 'fixed';
    item.style.zIndex = '9999';
    item.style.width = rect.width + 'px';
    item.style.opacity = '0.8';
    item.style.cursor = 'grabbing';
    item.style.pointerEvents = 'none';
    item.classList.add('shadow-lg', 'dragging', 'no-transition');
    container.classList.add('sortable-active');
    
    // Position element at the exact position relative to mouse
    item.style.left = (e.clientX - elementOffset.x) + 'px';
    item.style.top = (e.clientY - elementOffset.y) + 'px';
    
    // Disable pointer events on all children
    setPointerEvents(false);
    
    // Add document listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection
    document.body.style.cursor = 'grabbing';
  }
  
  // Handle mouse move
  function handleMouseMove(e) {
    if (!draggedElement) return;
    
    e.preventDefault();
    
    // Cancel previous animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    // Schedule position update with requestAnimationFrame
    animationFrameId = requestAnimationFrame(() => {
      if (!draggedElement) return;
      
      // Update position
      if (axis !== 'x') {
        draggedElement.style.top = (e.clientY - elementOffset.y) + 'px';
      }
      if (axis !== 'y') {
        draggedElement.style.left = (e.clientX - elementOffset.x) + 'px';
      }
      
      // Throttle placeholder updates
      const now = Date.now();
      if (now - lastPlaceholderMove < PLACEHOLDER_THROTTLE) {
        return;
      }
      lastPlaceholderMove = now;
      
      // Find the best insertion point
      const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
      
      // Move placeholder to new position
      if (afterElement && afterElement !== placeholder) {
        if (afterElement.nextSibling === placeholder) {
          // Already in correct position
          return;
        }
        container.insertBefore(placeholder, afterElement.nextSibling);
      } else if (!afterElement && container.firstChild !== placeholder) {
        // Insert at beginning
        container.insertBefore(placeholder, container.firstChild);
      }
    });
  }
  
  // Handle mouse up
  function handleMouseUp(e) {
    if (!draggedElement) return;
    
    e.preventDefault();
    
    // Cancel any pending animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    // Restore element styles
    if (draggedElement._originalStyles) {
      Object.assign(draggedElement.style, draggedElement._originalStyles);
      delete draggedElement._originalStyles;
    }
    
    draggedElement.classList.remove('shadow-lg', 'dragging', 'no-transition');
    container.classList.remove('sortable-active');
    
    // Insert element at placeholder position
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(draggedElement, placeholder);
      placeholder.remove();
    }
    
    // Get new index
    const newIndex = getItemIndex(draggedElement);
    
    // Call onSort if order changed
    if (draggedIndex !== newIndex && draggedIndex !== -1 && newIndex !== -1) {
      onSort({
        oldIndex: draggedIndex,
        newIndex: newIndex,
        item: draggedElement
      });
    }
    
    // Cleanup
    draggedElement = null;
    draggedIndex = null;
    placeholder = null;
    lastValidTarget = null;
    lastPlaceholderMove = 0;
    
    // Re-enable pointer events
    setPointerEvents(true);
    
    // Remove document listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Re-enable text selection
    document.body.style.cursor = '';
  }
  
  // Get element after which to insert based on mouse position
  function getDragAfterElement(container, x, y) {
    const draggableElements = getItems().filter(el => el !== draggedElement && !el.classList.contains('sortable-placeholder'));
    
    let closestElement = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    
    // Cache bounding rectangles for performance
    const elementRects = new Map();
    draggableElements.forEach(el => {
      elementRects.set(el, el.getBoundingClientRect());
    });
    
    draggableElements.forEach(child => {
      const box = elementRects.get(child);
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestElement = child;
      }
    });
    
    // If no element found, check if we should append at end
    if (!closestElement && draggableElements.length > 0) {
      const lastElement = draggableElements[draggableElements.length - 1];
      const lastBox = elementRects.get(lastElement);
      if (y > lastBox.bottom) {
        return lastElement;
      }
    }
    
    return closestElement;
  }
  
  // Initialize
  container.addEventListener('mousedown', handleMouseDown);
  
  // Return destroy function
  return () => {
    container.removeEventListener('mousedown', handleMouseDown);
  };
}