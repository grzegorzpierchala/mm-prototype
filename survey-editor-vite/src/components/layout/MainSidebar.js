// Main Sidebar Component - Navigation menu for Mindful Metrics platform
export function MainSidebar() {
  return `
    <div class="fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-700 transition-all duration-300 ease-out z-40 flex flex-col"
         :class="{
           'w-64': !$store.ui.sidebarCollapsed,
           'w-16': $store.ui.sidebarCollapsed
         }"
         x-data="{ hoveredItem: null }">
      
      <!-- Header with Logo/Branding -->
      <div class="px-6 py-3 border-b border-gray-700 flex-shrink-0">
        <div class="flex items-center justify-between">
          <!-- Logo and Brand Name -->
          <div class="flex items-center space-x-3"
               x-show="!$store.ui.sidebarCollapsed"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0"
               x-transition:enter-end="opacity-100"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100"
               x-transition:leave-end="opacity-0">
            <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <div>
              <h1 class="font-medium text-white text-lg tracking-tight">Mindful Metrics</h1>
            </div>
          </div>
          
          <!-- Collapsed Logo -->
          <svg class="w-6 h-6 text-indigo-400 mx-auto"
               x-show="$store.ui.sidebarCollapsed"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0"
               x-transition:enter-end="opacity-100"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100"
               x-transition:leave-end="opacity-0"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          
          <!-- Collapse Toggle Button -->
          <button @click="$store.ui.toggleSidebar()"
                  class="p-1 rounded text-gray-400 hover:text-gray-300 transition-colors"
                  x-show="!$store.ui.sidebarCollapsed"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0"
                  x-transition:enter-end="opacity-100"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-start="opacity-100"
                  x-transition:leave-end="opacity-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        
        <!-- Surveys (Active) -->
        <div class="relative">
          <a href="#" 
             @click.prevent="$store.ui.setActivePage('surveys')"
             @mouseenter="hoveredItem = 'surveys'"
             @mouseleave="hoveredItem = null"
             class="group flex items-center px-2 py-2.5 text-base font-medium rounded-lg transition-all duration-200 relative"
             :class="{
               'text-indigo-300 bg-indigo-900/30': $store.ui.activePage === 'surveys',
               'text-gray-300 hover:text-white hover:bg-gray-800': $store.ui.activePage !== 'surveys'
             }">
            <svg class="w-5 h-5 mr-3 flex-shrink-0"
                 :class="{
                   'text-indigo-400': $store.ui.activePage === 'surveys',
                   'text-gray-400 group-hover:text-gray-300': $store.ui.activePage !== 'surveys'
                 }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            
            <!-- Active state indicator -->
            <div x-show="$store.ui.activePage === 'surveys'" 
                 class="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-r-full"></div>
            <span x-show="!$store.ui.sidebarCollapsed"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0"
                  x-transition:enter-end="opacity-100"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-start="opacity-100"
                  x-transition:leave-end="opacity-0">
              Surveys
            </span>
          </a>
          
          <!-- Tooltip for collapsed state -->
          <div x-show="$store.ui.sidebarCollapsed && hoveredItem === 'surveys'"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0 transform translate-x-2"
               x-transition:enter-end="opacity-100 transform translate-x-0"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100 transform translate-x-0"
               x-transition:leave-end="opacity-0 transform translate-x-2"
               class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 shadow-lg">
            Surveys
            <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>

        <!-- Interviews (Coming Soon) -->
        <div class="relative">
          <a href="#" 
             @click.prevent=""
             @mouseenter="hoveredItem = 'interviews'"
             @mouseleave="hoveredItem = null"
             class="group flex items-center px-2 py-2.5 text-base font-medium rounded-lg text-gray-500 cursor-not-allowed">
            <svg class="w-5 h-5 mr-3 flex-shrink-0 text-gray-600"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span x-show="!$store.ui.sidebarCollapsed"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0"
                  x-transition:enter-end="opacity-100"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-start="opacity-100"
                  x-transition:leave-end="opacity-0"
                  class="flex items-center">
              Interviews
              <span class="ml-2 px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded-full font-medium">Soon</span>
            </span>
          </a>
          
          <!-- Tooltip for collapsed state -->
          <div x-show="$store.ui.sidebarCollapsed && hoveredItem === 'interviews'"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0 transform translate-x-2"
               x-transition:enter-end="opacity-100 transform translate-x-0"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100 transform translate-x-0"
               x-transition:leave-end="opacity-0 transform translate-x-2"
               class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 shadow-lg">
            Interviews (Coming Soon)
            <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>

        <!-- Usability Testing (Coming Soon) -->
        <div class="relative">
          <a href="#" 
             @click.prevent=""
             @mouseenter="hoveredItem = 'usability'"
             @mouseleave="hoveredItem = null"
             class="group flex items-center px-2 py-2.5 text-base font-medium rounded-lg text-gray-500 cursor-not-allowed">
            <svg class="w-5 h-5 mr-3 flex-shrink-0 text-gray-600"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span x-show="!$store.ui.sidebarCollapsed"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0"
                  x-transition:enter-end="opacity-100"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-start="opacity-100"
                  x-transition:leave-end="opacity-0"
                  class="flex items-center">
              Usability Testing
              <span class="ml-2 px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded-full font-medium">Soon</span>
            </span>
          </a>
          
          <!-- Tooltip for collapsed state -->
          <div x-show="$store.ui.sidebarCollapsed && hoveredItem === 'usability'"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0 transform translate-x-2"
               x-transition:enter-end="opacity-100 transform translate-x-0"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100 transform translate-x-0"
               x-transition:leave-end="opacity-0 transform translate-x-2"
               class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 shadow-lg">
            Usability Testing (Coming Soon)
            <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>
      </nav>

      <!-- Bottom Section (Fixed to bottom) -->
      <div class="border-t border-gray-700 p-2 space-y-1 flex-shrink-0" x-data="{ userDropdownOpen: false }">
        
        <!-- User Section with Dropdown -->
        <div class="relative">
          <button @click="userDropdownOpen = !userDropdownOpen"
                  @mouseenter="hoveredItem = 'user'"
                  @mouseleave="hoveredItem = null"
                  class="w-full group flex items-center px-2 py-2.5 text-base font-medium rounded-lg transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-800">
            <div class="w-5 h-5 mr-3 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
              <span class="text-xs font-medium text-white">JD</span>
            </div>
            <span x-show="!$store.ui.sidebarCollapsed"
                  x-transition:enter="transition ease-out duration-200"
                  x-transition:enter-start="opacity-0"
                  x-transition:enter-end="opacity-100"
                  x-transition:leave="transition ease-in duration-150"
                  x-transition:leave-start="opacity-100"
                  x-transition:leave-end="opacity-0"
                  class="flex-1 text-left">
              John Doe
            </span>
            <svg x-show="!$store.ui.sidebarCollapsed" 
                 class="w-4 h-4 transition-transform duration-200"
                 :class="{ 'transform rotate-180': userDropdownOpen }"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <!-- User Dropdown Menu -->
          <div x-show="userDropdownOpen && !$store.ui.sidebarCollapsed"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0 transform scale-95"
               x-transition:enter-end="opacity-100 transform scale-100"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100 transform scale-100"
               x-transition:leave-end="opacity-0 transform scale-95"
               @click.away="userDropdownOpen = false"
               class="absolute bottom-full left-2 right-2 mb-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-1 z-50">
            <a href="#" 
               @click.prevent="$store.ui.setActivePage('profile'); userDropdownOpen = false"
               class="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </a>
            <a href="#" 
               @click.prevent="$store.ui.setActivePage('settings'); userDropdownOpen = false"
               class="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </a>
            <div class="border-t border-gray-600 my-1"></div>
            <a href="#" 
               @click.prevent=""
               class="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
              <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign out
            </a>
          </div>
          
          <!-- Tooltip for collapsed state -->
          <div x-show="$store.ui.sidebarCollapsed && hoveredItem === 'user'"
               x-transition:enter="transition ease-out duration-200"
               x-transition:enter-start="opacity-0 transform translate-x-2"
               x-transition:enter-end="opacity-100 transform translate-x-0"
               x-transition:leave="transition ease-in duration-150"
               x-transition:leave-start="opacity-100 transform translate-x-0"
               x-transition:leave-end="opacity-0 transform translate-x-2"
               class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-700 text-white text-sm rounded whitespace-nowrap z-50 shadow-lg">
            John Doe
            <div class="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-700"></div>
          </div>
        </div>

        <!-- Expand Button (only visible when collapsed) -->
        <button @click="$store.ui.toggleSidebar()"
                x-show="$store.ui.sidebarCollapsed"
                x-transition:enter="transition ease-out duration-200"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
                x-transition:leave="transition ease-in duration-150"
                x-transition:leave-start="opacity-100"
                x-transition:leave-end="opacity-0"
                class="w-full flex items-center justify-center px-2 py-2.5 text-gray-400 hover:text-gray-300 rounded-lg transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  `
}