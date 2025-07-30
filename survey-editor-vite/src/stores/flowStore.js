import Alpine from 'alpinejs'

// Flow Store - Managing survey flow elements and connections
Alpine.store('flow', {
  // Flow elements array
  elements: [
    {
      id: 'start',
      type: 'start',
      label: 'Survey Start',
      x: 100,
      y: 50,
      connections: ['block-1']
    },
    {
      id: 'block-1',
      type: 'block',
      label: 'Welcome Block',
      questionIds: ['Q1', 'Q2', 'Q3'],
      x: 100,
      y: 150,
      connections: ['end']
    },
    {
      id: 'end',
      type: 'end',
      label: 'End of Survey',
      x: 100,
      y: 300,
      connections: []
    }
  ],
  
  // Selected element
  selectedElement: null,
  
  // Drag state
  isDragging: false,
  draggedElement: null,
  dragOffset: { x: 0, y: 0 },
  
  // Connection state
  isConnecting: false,
  connectionStart: null,
  
  // Canvas state
  canvasOffset: { x: 0, y: 0 },
  zoom: 1,
  
  // Element types palette
  elementTypes: {
    block: {
      name: 'Question Block',
      icon: '📋',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300',
      description: 'Group of survey questions'
    },
    branch: {
      name: 'Branch Logic',
      icon: '🔀',
      color: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Conditional paths based on answers'
    },
    randomizer: {
      name: 'Randomizer',
      icon: '🎲',
      color: 'bg-purple-50',
      borderColor: 'border-purple-300',
      description: 'Randomly show elements'
    },
    embedded: {
      name: 'Embedded Data',
      icon: '💾',
      color: 'bg-green-50',
      borderColor: 'border-green-300',
      description: 'Set custom variables'
    },
    end: {
      name: 'End of Survey',
      icon: '🏁',
      color: 'bg-red-50',
      borderColor: 'border-red-300',
      description: 'Terminate survey'
    }
  },
  
  // Actions
  addElement(type, x = 200, y = 200) {
    const id = `${type}-${Date.now()}`
    const elementType = this.elementTypes[type]
    
    const newElement = {
      id,
      type,
      label: elementType.name,
      x,
      y,
      connections: []
    }
    
    // Add type-specific properties
    switch (type) {
      case 'block':
        newElement.questionIds = []
        break
      case 'branch':
        newElement.conditions = []
        newElement.branches = []
        break
      case 'randomizer':
        newElement.showCount = 1
        newElement.elements = []
        break
      case 'embedded':
        newElement.variables = []
        break
      case 'end':
        newElement.message = 'Thank you for completing the survey!'
        break
    }
    
    this.elements.push(newElement)
    return newElement
  },
  
  updateElement(id, updates) {
    const element = this.elements.find(el => el.id === id)
    if (element) {
      Object.assign(element, updates)
    }
  },
  
  deleteElement(id) {
    if (id === 'start' || id === 'end') return // Can't delete start/end
    
    // Remove element
    this.elements = this.elements.filter(el => el.id !== id)
    
    // Remove connections to this element
    this.elements.forEach(el => {
      el.connections = el.connections.filter(conn => conn !== id)
    })
    
    if (this.selectedElement === id) {
      this.selectedElement = null
    }
  },
  
  selectElement(id) {
    this.selectedElement = id
  },
  
  // Drag and drop
  startDrag(elementId, event) {
    const element = this.elements.find(el => el.id === elementId)
    if (!element) return
    
    this.isDragging = true
    this.draggedElement = elementId
    
    // Calculate offset accounting for canvas transform
    const canvasRect = event.currentTarget.closest('[x-ref="flowCanvas"]').getBoundingClientRect()
    const scaledX = (event.clientX - canvasRect.left - this.canvasOffset.x) / this.zoom
    const scaledY = (event.clientY - canvasRect.top - this.canvasOffset.y) / this.zoom
    
    this.dragOffset = {
      x: scaledX - element.x,
      y: scaledY - element.y
    }
  },
  
  updateDrag(event) {
    if (!this.isDragging || !this.draggedElement) return
    
    const element = this.elements.find(el => el.id === this.draggedElement)
    if (element) {
      // Get canvas rect for proper coordinate transformation
      const canvasRect = event.currentTarget.closest('[x-ref="flowCanvas"]').getBoundingClientRect()
      const scaledX = (event.clientX - canvasRect.left - this.canvasOffset.x) / this.zoom
      const scaledY = (event.clientY - canvasRect.top - this.canvasOffset.y) / this.zoom
      
      element.x = scaledX - this.dragOffset.x
      element.y = scaledY - this.dragOffset.y
    }
  },
  
  endDrag() {
    this.isDragging = false
    this.draggedElement = null
    this.dragOffset = { x: 0, y: 0 }
  },
  
  // Connections
  startConnection(elementId) {
    this.isConnecting = true
    this.connectionStart = elementId
  },
  
  completeConnection(targetId) {
    if (!this.isConnecting || !this.connectionStart) return
    
    const startElement = this.elements.find(el => el.id === this.connectionStart)
    if (startElement && !startElement.connections.includes(targetId)) {
      startElement.connections.push(targetId)
    }
    
    this.isConnecting = false
    this.connectionStart = null
  },
  
  removeConnection(fromId, toId) {
    const element = this.elements.find(el => el.id === fromId)
    if (element) {
      element.connections = element.connections.filter(conn => conn !== toId)
    }
  },
  
  // Get all question blocks for block selection
  getQuestionBlocks() {
    return Alpine.store('survey').questions.map(q => ({
      id: q.id,
      label: `${q.questionNumber} - ${q.text.substring(0, 50)}...`
    }))
  },
  
  // Canvas navigation
  panCanvas(deltaX, deltaY) {
    this.canvasOffset.x += deltaX
    this.canvasOffset.y += deltaY
  },
  
  zoomCanvas(delta) {
    const newZoom = Math.max(0.5, Math.min(2, this.zoom + delta))
    this.zoom = newZoom
  },
  
  resetView() {
    this.canvasOffset = { x: 0, y: 0 }
    this.zoom = 1
  },
  
  // Get all connections with computed positions for CSS rendering
  getConnections() {
    const connections = []
    this.elements.forEach(fromEl => {
      fromEl.connections.forEach(toId => {
        const toEl = this.elements.find(el => el.id === toId)
        if (toEl) {
          // Calculate connection points (center bottom to center top)
          const startX = fromEl.x + 120 // Center of 240px wide element
          const startY = fromEl.y + 80  // Bottom of element (assuming ~80px height)
          const endX = toEl.x + 120     // Center of target element
          const endY = toEl.y           // Top of target element
          
          connections.push({
            id: fromEl.id + '-' + toId,
            fromId: fromEl.id,
            toId: toId,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
          })
        }
      })
    })
    return connections
  }
})