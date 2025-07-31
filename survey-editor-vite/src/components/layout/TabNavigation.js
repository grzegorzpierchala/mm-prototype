// Tab Navigation Component
export function TabNavigation() {
  return `
    <nav class="bg-white border-b border-gray-200 transition-all duration-300 ease-out"
         :class="{
           'ml-64': !$store.ui.sidebarCollapsed,
           'ml-16': $store.ui.sidebarCollapsed
         }"
         :style="{ marginLeft: $store.ui.sidebarCollapsed ? '4rem' : '16rem' }">
      <div class="px-6">
        <div class="flex space-x-8">
          <button @click="$store.ui.setActiveTab('build')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'build' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Build
          </button>
          <button @click="$store.ui.setActiveTab('flow')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'flow' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Flow
          </button>
          <button @click="$store.ui.setActiveTab('preview')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'preview' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Preview
          </button>
          <button @click="$store.ui.setActiveTab('share')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'share' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Share
          </button>
          <button @click="$store.ui.setActiveTab('results')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'results' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Results
          </button>
          <button class="py-3 px-1 border-b-2 font-medium text-base transition-colors border-transparent text-gray-400 cursor-not-allowed" disabled>
            Analytics
          </button>
          <button @click="$store.ui.setActiveTab('settings')" 
                  class="py-3 px-1 border-b-2 font-medium text-base transition-colors" 
                  :class="$store.ui.activeTab === 'settings' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'">
            Settings
          </button>
        </div>
      </div>
    </nav>
  `
}