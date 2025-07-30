// Flow Page Component - Survey flow editor
import { FlowEditor } from '../ui/FlowEditor'

export function FlowPage() {
  return `
    <!-- Flow Tab Content -->
    <div x-show="$store.ui.activeTab === 'flow'" 
         x-data="{
           showElementPalette: false,
           isDraggingNewElement: false,
           draggedType: null,
           mousePos: { x: 0, y: 0 },
           dragPreviewOffset: { x: 20, y: 20 },
           
           handlePaletteDragStart(type, event) {
             this.isDraggingNewElement = true
             this.draggedType = type
             
             // Calculate offset for preview positioning
             const rect = event.currentTarget.getBoundingClientRect()
             this.dragPreviewOffset.x = event.clientX - rect.left
             this.dragPreviewOffset.y = event.clientY - rect.top
             
             // Create custom drag image
             event.dataTransfer.effectAllowed = 'copy'
             event.dataTransfer.setData('elementType', type)
             
             // Hide default drag image
             const dragImage = new Image()
             dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
             event.dataTransfer.setDragImage(dragImage, 0, 0)
           },
           
           handlePaletteDragEnd() {
             this.isDraggingNewElement = false
             this.draggedType = null
           },
           
           handleCanvasDrop(event) {
             event.preventDefault()
             const elementType = event.dataTransfer.getData('elementType')
             
             if (elementType || (this.isDraggingNewElement && this.draggedType)) {
               const type = elementType || this.draggedType
               const canvas = $refs.flowCanvas
               const rect = canvas.getBoundingClientRect()
               
               // Calculate position accounting for zoom and pan
               const x = (event.clientX - rect.left - $store.flow.canvasOffset.x) / $store.flow.zoom
               const y = (event.clientY - rect.top - $store.flow.canvasOffset.y) / $store.flow.zoom
               
               // Add element at drop position
               const newElement = $store.flow.addElement(type, x - 120, y - 40) // Center the element
               
               // Select the new element
               $store.flow.selectElement(newElement.id)
               
               this.isDraggingNewElement = false
               this.draggedType = null
             }
           },
           
           handleCanvasDragOver(event) {
             event.preventDefault()
             event.dataTransfer.dropEffect = 'copy'
           },
           
           updateMousePos(event) {
             this.mousePos.x = event.clientX
             this.mousePos.y = event.clientY
           }
         }"
         class="h-full">
      
      <!-- Flow Editor Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Survey Flow</h2>
            <p class="text-sm text-gray-500 mt-1">Design the logic and path of your survey</p>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Zoom Controls -->
            <div class="flex items-center bg-gray-100 rounded-lg">
              <button @click="$store.flow.zoomCanvas(-0.1)"
                      class="p-2 hover:bg-gray-200 rounded-l-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="px-3 text-sm font-medium" x-text="Math.round($store.flow.zoom * 100) + '%'">100%</span>
              <button @click="$store.flow.zoomCanvas(0.1)"
                      class="p-2 hover:bg-gray-200 rounded-r-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
            
            <!-- Reset View -->
            <button @click="$store.flow.resetView()"
                    class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Reset view">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
            
            <!-- Add Element Button -->
            <button @click="showElementPalette = !showElementPalette"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Element</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Flow Editor Container -->
      <div class="relative h-[calc(100vh-200px)] bg-gray-50 overflow-hidden">
        
        <!-- Element Palette -->
        <div x-show="showElementPalette"
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 scale-95"
             x-transition:enter-end="opacity-100 scale-100"
             @click.away="showElementPalette = false"
             class="absolute top-4 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
          
          <div class="p-4 border-b border-gray-100">
            <h3 class="font-medium text-gray-900">Flow Elements</h3>
            <p class="text-sm text-gray-500 mt-1">Drag elements to the canvas</p>
          </div>
          
          <div class="p-4 space-y-2">
            <template x-for="(element, type) in $store.flow.elementTypes" :key="type">
              <div x-show="type !== 'start'"
                   @dragstart="handlePaletteDragStart(type, $event)"
                   @dragend="handlePaletteDragEnd()"
                   class="p-3 rounded-lg border cursor-move hover:shadow-sm hover:scale-105 transition-all"
                   :class="[element.color, element.borderColor, 
                           isDraggingNewElement && draggedType === type ? 'opacity-50' : '']"
                   draggable="true">
                <div class="flex items-start space-x-3">
                  <span class="text-2xl" x-text="element.icon"></span>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900" x-text="element.name"></div>
                    <div class="text-xs text-gray-600 mt-0.5" x-text="element.description"></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Canvas -->
        <div x-ref="flowCanvas"
             @drop="handleCanvasDrop($event)"
             @dragover="handleCanvasDragOver($event)"
             @mousemove="updateMousePos($event)"
             class="absolute inset-0 overflow-hidden"
             :class="{ 'ring-2 ring-indigo-400 ring-inset': isDraggingNewElement }">
          ${FlowEditor()}
        </div>
        
        <!-- Drag Preview -->
        <div x-show="isDraggingNewElement && draggedType"
             x-transition:enter="transition ease-out duration-150"
             x-transition:enter-start="opacity-0 scale-95"
             x-transition:enter-end="opacity-100 scale-100"
             :style="{
               position: 'fixed',
               left: (mousePos.x - dragPreviewOffset.x) + 'px',
               top: (mousePos.y - dragPreviewOffset.y) + 'px',
               pointerEvents: 'none',
               zIndex: 50
             }">
          <div class="p-3 rounded-lg border-2 shadow-2xl transform rotate-3 opacity-80"
               :class="$store.flow.elementTypes[draggedType] ? [$store.flow.elementTypes[draggedType].color, $store.flow.elementTypes[draggedType].borderColor] : ''">
            <div class="flex items-center space-x-2">
              <span class="text-xl" x-text="$store.flow.elementTypes[draggedType]?.icon"></span>
              <span class="font-medium" x-text="$store.flow.elementTypes[draggedType]?.name"></span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `
}