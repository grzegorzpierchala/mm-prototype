// Keyboard Shortcuts Help Dialog
export function KeyboardHelp() {
  return `
    <!-- Keyboard Shortcuts Help Modal -->
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
         x-show="$store.ui.showKeyboardHelp"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-1"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-1"
         x-transition:leave-end="opacity-0"
         @click.away="$store.ui.showKeyboardHelp = false"
         @keydown.escape="$store.ui.showKeyboardHelp = false">
      
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
           x-show="$store.ui.showKeyboardHelp"
           x-transition:enter="transition ease-out duration-300"
           x-transition:enter-start="opacity-0 scale-95"
           x-transition:enter-end="opacity-100 scale-100"
           x-transition:leave="transition ease-in duration-200"
           x-transition:leave-start="opacity-100 scale-100"
           x-transition:leave-end="opacity-0 scale-95"
           @click.stop>
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h3>
            <button @click="$store.ui.showKeyboardHelp = false"
                    class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Navigation -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Navigation</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Navigate questions</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">↑</span>
                    <span class="kbd">↓</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Actions</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Save</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">⌘</span>
                    <span class="text-gray-400 text-xs">/</span>
                    <span class="kbd">Ctrl</span>
                    <span class="text-gray-400 text-xs">+</span>
                    <span class="kbd">S</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Add question</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">⌘</span>
                    <span class="text-gray-400 text-xs">/</span>
                    <span class="kbd">Ctrl</span>
                    <span class="text-gray-400 text-xs">+</span>
                    <span class="kbd">Enter</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Duplicate question</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">⌘</span>
                    <span class="text-gray-400 text-xs">/</span>
                    <span class="kbd">Ctrl</span>
                    <span class="text-gray-400 text-xs">+</span>
                    <span class="kbd">D</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Delete question</span>
                  <span class="kbd">Delete</span>
                </div>
              </div>
            </div>
            
            <!-- Panels -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Panels</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Version history</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">⌘</span>
                    <span class="text-gray-400 text-xs">/</span>
                    <span class="kbd">Ctrl</span>
                    <span class="text-gray-400 text-xs">+</span>
                    <span class="kbd">H</span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Settings</span>
                  <div class="flex gap-1 items-center">
                    <span class="kbd">⌘</span>
                    <span class="text-gray-400 text-xs">/</span>
                    <span class="kbd">Ctrl</span>
                    <span class="text-gray-400 text-xs">+</span>
                    <span class="kbd">,</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Help -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Help</h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Show shortcuts</span>
                  <span class="kbd">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}