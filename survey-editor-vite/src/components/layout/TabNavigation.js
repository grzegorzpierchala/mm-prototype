// Tab Navigation Component
export function TabNavigation() {
  const tabs = [
    { id: 'build', label: 'Build', enabled: true },
    { id: 'preview', label: 'Preview', enabled: true },
    { id: 'share', label: 'Share', enabled: true },
    { id: 'results', label: 'Results', enabled: false },
    { id: 'analytics', label: 'Analytics', enabled: false },
    { id: 'settings', label: 'Settings', enabled: true }
  ]
  
  return `
    <nav class="bg-white border-b border-gray-200">
      <div class="px-6">
        <div class="flex space-x-8">
          ${tabs.map(tab => `
            <button 
              @click="${tab.enabled ? `$store.ui.setActiveTab('${tab.id}')` : ''}" 
              class="py-3 px-1 border-b-2 font-medium text-base transition-colors ${
                tab.enabled 
                  ? `:class="$store.ui.activeTab === '${tab.id}' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'"`
                  : 'border-transparent text-gray-400 cursor-not-allowed'
              }"
              ${!tab.enabled ? 'disabled' : ''}>
              ${tab.label}
            </button>
          `).join('')}
        </div>
      </div>
    </nav>
  `
}