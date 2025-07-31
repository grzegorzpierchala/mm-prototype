// Header Component
export function Header() {
  return `
    <header class="bg-white border-b border-gray-200 px-6 py-3 transition-all duration-300 ease-out"
            :class="{
              'ml-64': !$store.ui.sidebarCollapsed,
              'ml-16': $store.ui.sidebarCollapsed
            }"
            :style="{ marginLeft: $store.ui.sidebarCollapsed ? '4rem' : '16rem' }">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 px-2">
          <a href="#" class="text-gray-500 hover:text-gray-700">← Surveys</a>
          <span class="text-gray-400">/</span>
          <h1 class="text-xl font-medium text-gray-900">Customer Satisfaction Survey 2024</h1>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Collaboration Avatars -->
          <div class="collab-avatars">
            <div class="collab-avatar bg-indigo-500 text-white text-xs" title="You">GP</div>
            <div class="collab-avatar bg-purple-500 text-white text-xs" title="Sarah Chen">SC</div>
            <div class="collab-avatar bg-green-500 text-white text-xs" title="Mike Johnson">MJ</div>
            <div class="collab-avatar text-xs" title="2 more team members">+2</div>
            <div class="activity-dot" title="Active now"></div>
          </div>
          
          <!-- Version Badge -->
          <div class="version-badge" 
               @click="$store.ui.toggleVersionHistory()" 
               title="View version history">
            <span>v3</span>
            <span class="text-xs opacity-70 ml-1">(2 hours ago)</span>
          </div>
          
          <!-- Undo/Redo Buttons -->
          <div class="flex items-center space-x-1">
            <!-- Undo Button -->
            <button @click="$store.history.undo()"
                    :disabled="!$store.history.canUndo()"
                    :title="$store.history.canUndo() ? \`Undo: \${$store.history.getUndoDescription()} (Ctrl+Z)\` : 'Nothing to undo (Ctrl+Z)'"
                    class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
              </svg>
            </button>
            
            <!-- Redo Button -->
            <button @click="$store.history.redo()"
                    :disabled="!$store.history.canRedo()"
                    :title="$store.history.canRedo() ? \`Redo: \${$store.history.getRedoDescription()} (Ctrl+Shift+Z)\` : 'Nothing to redo (Ctrl+Shift+Z)'"
                    class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/>
              </svg>
            </button>
          </div>
          
          <!-- Status Dropdown -->
          <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" 
                    class="flex items-center space-x-1.5 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
              <span class="text-sm font-medium" 
                    x-text="$store.survey.status.charAt(0).toUpperCase() + $store.survey.status.slice(1)"></span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div x-show="open" 
                 @click.away="open = false" 
                 x-transition 
                 class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <button @click="$store.survey.status = 'draft'; open = false" 
                      class="w-full text-left px-4 py-2 text-base hover:bg-gray-100 flex items-center">
                <span x-show="$store.survey.status === 'draft'" class="mr-2">✓</span>
                <span x-show="$store.survey.status !== 'draft'" class="mr-2 opacity-0">✓</span>
                Draft
              </button>
              <button @click="$store.survey.status = 'published'; open = false" 
                      class="w-full text-left px-4 py-2 text-base hover:bg-gray-100 flex items-center">
                <span x-show="$store.survey.status === 'published'" class="mr-2">✓</span>
                <span x-show="$store.survey.status !== 'published'" class="mr-2 opacity-0">✓</span>
                Published
              </button>
              <button @click="$store.survey.status = 'archived'; open = false" 
                      class="w-full text-left px-4 py-2 text-base hover:bg-gray-100 flex items-center">
                <span x-show="$store.survey.status === 'archived'" class="mr-2">✓</span>
                <span x-show="$store.survey.status !== 'archived'" class="mr-2 opacity-0">✓</span>
                Archived
              </button>
            </div>
          </div>
          
          <!-- Save Indicator -->
          <div class="save-indicator text-sm text-gray-500" x-show="$store.ui.saveStatus">
            <span x-show="$store.ui.saveStatus === 'saving'">Saving...</span>
            <span x-show="$store.ui.saveStatus === 'saved'" class="text-green-600">Saved ✓</span>
            <span x-show="$store.ui.saveStatus === 'error'" class="text-red-600">Error ✗</span>
          </div>
          
          <!-- Keyboard Shortcuts Help -->
          <button @click="$store.ui.showKeyboardHelp = true" 
                  class="text-gray-500 hover:text-gray-700" 
                  title="Keyboard shortcuts (Shift+/)">
            <span class="kbd">?</span>
          </button>
        </div>
      </div>
    </header>
  `
}