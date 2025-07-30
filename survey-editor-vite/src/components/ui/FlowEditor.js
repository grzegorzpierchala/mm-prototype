// Flow Editor Component - Canvas-based flow visualization
export function FlowEditor() {
  return `
    <div x-data="{
      isPanning: false,
      panStart: { x: 0, y: 0 },
      
      startPan(event) {
        if (event.target.closest('.flow-element')) return
        this.isPanning = true
        this.panStart = { x: event.clientX, y: event.clientY }
      },
      
      updatePan(event) {
        if (!this.isPanning) return
        const deltaX = event.clientX - this.panStart.x
        const deltaY = event.clientY - this.panStart.y
        $store.flow.panCanvas(deltaX, deltaY)
        this.panStart = { x: event.clientX, y: event.clientY }
      },
      
      endPan() {
        this.isPanning = false
      }
    }"
    @mousedown="startPan($event)"
    @mousemove="$store.flow.isDragging ? $store.flow.updateDrag($event) : updatePan($event)"
    @mouseup="$store.flow.isDragging ? $store.flow.endDrag() : endPan()"
    @mouseleave="$store.flow.isDragging ? $store.flow.endDrag() : endPan()"
    class="w-full h-full relative cursor-grab"
    :class="{ 
      'cursor-grabbing': isPanning,
      'cursor-move': $store.flow.isDragging 
    }">
    
    <!-- Connection Lines Container -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div :style="{
             transform: \`translate(\${$store.flow.canvasOffset.x}px, \${$store.flow.canvasOffset.y}px) scale(\${$store.flow.zoom})\`,
             transformOrigin: 'top left'
           }">
        <!-- Simple connection lines -->
        <template x-for="connection in $store.flow.getConnections()" :key="connection.id">
          <div>
            <!-- Vertical line down from start element -->
            <div class="absolute bg-gray-400"
                 :style="{
                   left: connection.startX + 'px',
                   top: connection.startY + 'px',
                   width: '2px',
                   height: Math.max(20, (connection.endY - connection.startY - 10)) + 'px'
                 }"></div>
            <!-- Arrow head pointing down -->
            <div class="absolute w-0 h-0"
                 :style="{
                   left: (connection.startX - 4) + 'px',
                   top: (connection.endY - 10) + 'px',
                   borderLeft: '4px solid transparent',
                   borderRight: '4px solid transparent',
                   borderTop: '8px solid #9ca3af'
                 }"></div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Flow Elements Container -->
    <div class="absolute inset-0"
         :style="{
           transform: \`translate(\${$store.flow.canvasOffset.x}px, \${$store.flow.canvasOffset.y}px) scale(\${$store.flow.zoom})\`,
           transformOrigin: 'top left'
         }">
      
      <!-- Render Elements -->
      <template x-for="element in $store.flow.elements" :key="element.id">
        <div @mousedown.stop="$store.flow.startDrag(element.id, $event)"
             @click="$store.flow.selectElement(element.id)"
             :style="{
               position: 'absolute',
               left: element.x + 'px',
               top: element.y + 'px',
               cursor: $store.flow.isDragging && $store.flow.draggedElement === element.id ? 'grabbing' : 'grab',
               zIndex: $store.flow.isDragging && $store.flow.draggedElement === element.id ? 10 : 1
             }"
             class="flow-element transition-transform"
             :class="{ 'scale-105': $store.flow.isDragging && $store.flow.draggedElement === element.id }">
          
          <!-- Element Node -->
          <div class="relative group">
            <div class="w-60 rounded-lg border-2 shadow-sm transition-all duration-200 hover:shadow-md"
                 :class="[
                   element.type === 'start' ? 'bg-green-50 border-green-300' :
                   element.type === 'end' ? 'bg-red-50 border-red-300' :
                   $store.flow.elementTypes[element.type] ? [$store.flow.elementTypes[element.type].color, $store.flow.elementTypes[element.type].borderColor] : 'bg-gray-100 border-gray-300',
                   $store.flow.selectedElement === element.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                 ]">
              
              <!-- Element Header -->
              <div class="px-4 py-3 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-xl" x-text="
                    element.type === 'start' ? '🚀' :
                    element.type === 'end' ? '🏁' :
                    $store.flow.elementTypes[element.type]?.icon || '📦'
                  "></span>
                  <span class="font-medium text-gray-900" x-text="element.label"></span>
                </div>
                
                <!-- Delete Button (not for start/end) -->
                <button x-show="element.type !== 'start' && element.type !== 'end'"
                        @click.stop="$store.flow.deleteElement(element.id)"
                        class="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Element Content -->
              <div x-show="element.type === 'block' && element.questionIds && element.questionIds.length > 0"
                   class="px-4 pb-3 text-xs text-gray-600">
                <span x-text="element.questionIds.length + ' questions'"></span>
              </div>
              
              <div x-show="element.type === 'branch'"
                   class="px-4 pb-3 text-xs text-gray-600">
                <span x-text="(element.branches?.length || 0) + ' branches'"></span>
              </div>
              
              <div x-show="element.type === 'randomizer'"
                   class="px-4 pb-3 text-xs text-gray-600">
                Show <span x-text="element.showCount || 1"></span> of <span x-text="(element.elements?.length || 0)"></span>
              </div>
              
              <div x-show="element.type === 'embedded'"
                   class="px-4 pb-3 text-xs text-gray-600">
                <span x-text="(element.variables?.length || 0) + ' variables'"></span>
              </div>
            </div>
            
            <!-- Connection Points -->
            <div x-show="element.type !== 'end'"
                 @click.stop="$store.flow.startConnection(element.id)"
                 class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-crosshair hover:border-indigo-500 hover:scale-125 transition-all"></div>
            
            <div x-show="element.type !== 'start' && $store.flow.isConnecting && $store.flow.connectionStart !== element.id"
                 @click.stop="$store.flow.completeConnection(element.id)"
                 class="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full cursor-crosshair hover:border-indigo-500 hover:scale-125 transition-all"></div>
          </div>
        </div>
      </template>
      
    </div>
    
    <!-- Connection Mode Indicator -->
    <div x-show="$store.flow.isConnecting"
         x-transition
         class="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
      Click on an element to connect
    </div>
    
  </div>
  `
}