// Settings Page Component
export function SettingsPage() {
  return `
    <!-- Settings Tab Content -->
    <div x-show="$store.ui.activeTab === 'settings'" 
         class="max-w-5xl mx-auto px-8 py-8"
         x-data="{ settingsSection: 'general' }">
      <div class="grid grid-cols-5 gap-10">
        <!-- Settings Sidebar -->
        <div class="col-span-1">
          <nav class="space-y-0.5">
            <button @click="settingsSection = 'general'" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors text-base" 
                    :class="settingsSection === 'general' ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              General
            </button>
            <button @click="settingsSection = 'design'" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors text-base" 
                    :class="settingsSection === 'design' ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              Design
            </button>
            <button @click="settingsSection = 'logic'" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors text-base" 
                    :class="settingsSection === 'logic' ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              Logic Rules
            </button>
            <button @click="settingsSection = 'integrations'" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors text-base" 
                    :class="settingsSection === 'integrations' ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              Integrations
            </button>
            <button @click="settingsSection = 'versions'" 
                    class="w-full text-left px-3 py-2 rounded-md transition-colors text-base" 
                    :class="settingsSection === 'versions' ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'">
              Versions
            </button>
            <div class="pt-4 mt-4 border-t border-gray-200">
              <button @click="settingsSection = 'danger'" 
                      class="w-full text-left px-3 py-2 rounded-md transition-colors text-base text-red-600 hover:bg-red-50">
                Danger Zone
              </button>
            </div>
          </nav>
        </div>
        
        <!-- Settings Content -->
        <div class="col-span-4">
          <!-- General Settings -->
          <div x-show="settingsSection === 'general'" x-transition>
            <h3 class="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-base font-medium text-gray-700 mb-1.5">Survey Name</label>
                <input type="text" 
                       x-model="$store.survey.title"
                       class="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors">
              </div>
              <div>
                <label class="block text-base font-medium text-gray-700 mb-1.5">Description</label>
                <textarea x-model="$store.survey.description"
                          class="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors" 
                          rows="3"></textarea>
              </div>
              <div>
                <label class="block text-base font-medium text-gray-700 mb-1.5">Survey URL</label>
                <div class="flex items-center space-x-2">
                  <input type="text" 
                         value="mindful-metrics.com/s/customer-satisfaction-2025" 
                         class="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600" 
                         readonly>
                  <button class="px-3 py-2 text-base text-gray-600 hover:text-gray-900 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-base font-medium text-gray-700 mb-1.5">Language</label>
                <select class="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Version History -->
          <div x-show="settingsSection === 'versions'" x-transition>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-gray-900">Version History</h3>
              <button @click="$store.ui.toggleVersionHistory()" class="text-base text-indigo-600 hover:text-indigo-700">
                View all changes →
              </button>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <p class="text-base text-gray-600">Your survey has been automatically saved <strong>3 times</strong> today with <strong>12 changes</strong> tracked.</p>
            </div>
            <div class="space-y-3">
              <!-- Current Version -->
              <div class="group bg-white border border-gray-200 rounded-lg p-4 transition-all hover:shadow-sm cursor-pointer" 
                   @click="$store.ui.toggleVersionHistory(); $store.versions.selectedVersion = 3">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <span class="font-medium text-base">Version 3</span>
                    <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Current</span>
                  </div>
                  <span class="text-base text-gray-500">2 hours ago</span>
                </div>
                <p class="text-base text-gray-600 mb-3">Added demographic questions block</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-base text-gray-500">
                    <div class="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs mr-2">S</div>
                    Sarah Chen
                  </div>
                  <span class="text-xs text-gray-500">4 changes</span>
                </div>
              </div>
              
              <!-- Previous Versions -->
              <div class="group bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm" 
                   @click="$store.ui.toggleVersionHistory(); $store.versions.selectedVersion = 2">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-base">Version 2</span>
                  <span class="text-base text-gray-500">Yesterday at 3:45 PM</span>
                </div>
                <p class="text-base text-gray-600 mb-3">Updated satisfaction scale from 3 to 5 points</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-base text-gray-500">
                    <div class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs mr-2">G</div>
                    You
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500">6 changes</span>
                    <button @click.stop="$store.versions.restoreVersion(2)" 
                            class="text-xs text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="group bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm" 
                   @click="$store.ui.toggleVersionHistory(); $store.versions.selectedVersion = 1">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-base">Version 1</span>
                  <span class="text-base text-gray-500">Jan 22, 2025</span>
                </div>
                <p class="text-base text-gray-600 mb-3">Initial survey creation</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-base text-gray-500">
                    <div class="w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs mr-2">G</div>
                    You
                  </div>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500">2 changes</span>
                    <button @click.stop="$store.versions.restoreVersion(1)" 
                            class="text-xs text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Auto-save Settings -->
            <div class="mt-8 pt-8 border-t border-gray-200">
              <h4 class="text-base font-medium text-gray-900 mb-4">Version Settings</h4>
              <div class="space-y-3">
                <label class="flex items-center justify-between">
                  <span class="text-base text-gray-700">Create version on publish</span>
                  <input type="checkbox" checked class="text-indigo-600 rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-base text-gray-700">Track detailed changes</span>
                  <input type="checkbox" checked class="text-indigo-600 rounded">
                </label>
                <label class="flex items-center justify-between">
                  <span class="text-base text-gray-700">Show inline diffs</span>
                  <input type="checkbox" class="text-indigo-600 rounded">
                </label>
              </div>
            </div>
          </div>
          
          <!-- Design Settings -->
          <div x-show="settingsSection === 'design'" x-transition>
            <h3 class="text-lg font-medium text-gray-900 mb-6">Design & Branding</h3>
            <div class="space-y-6">
              <div>
                <label class="block text-base font-medium text-gray-700 mb-3">Theme Color</label>
                <div class="flex items-center space-x-3">
                  <button class="w-10 h-10 bg-indigo-600 rounded-lg ring-2 ring-offset-2 ring-indigo-600"></button>
                  <button class="w-10 h-10 bg-purple-600 rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-purple-600 transition-all"></button>
                  <button class="w-10 h-10 bg-blue-600 rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-blue-600 transition-all"></button>
                  <button class="w-10 h-10 bg-green-600 rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-green-600 transition-all"></button>
                  <button class="w-10 h-10 bg-gray-800 rounded-lg hover:ring-2 hover:ring-offset-2 hover:ring-gray-800 transition-all"></button>
                  <div class="ml-4 text-base text-gray-500">Custom</div>
                </div>
              </div>
              <div>
                <label class="block text-base font-medium text-gray-700 mb-3">Logo</label>
                <div class="flex items-center space-x-4">
                  <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <button class="px-4 py-2 text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                    Upload Logo
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-base font-medium text-gray-700 mb-1.5">Font</label>
                <select class="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>System Default</option>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Integrations -->
          <div x-show="settingsSection === 'integrations'" x-transition>
            <h3 class="text-lg font-medium text-gray-900 mb-6">Integrations</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span class="text-lg">📊</span>
                  </div>
                  <div>
                    <h4 class="text-base font-medium">Google Analytics</h4>
                    <p class="text-base text-gray-500">Track survey completions and drop-offs</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Connect
                </button>
              </div>
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span class="text-lg">💬</span>
                  </div>
                  <div>
                    <h4 class="text-base font-medium">Slack</h4>
                    <p class="text-base text-gray-500">Get notified of new responses</p>
                  </div>
                </div>
                <button class="px-3 py-1.5 text-base border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Connect
                </button>
              </div>
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span class="text-lg">📧</span>
                  </div>
                  <div>
                    <h4 class="text-base font-medium">Mailchimp</h4>
                    <p class="text-base text-gray-500">Sync respondents to your lists</p>
                  </div>
                </div>
                <span class="px-3 py-1.5 text-base text-green-700 bg-green-100 rounded-md">
                  Connected
                </span>
              </div>
            </div>
          </div>
          
          <!-- Logic Rules -->
          <div x-show="settingsSection === 'logic'" x-transition>
            <h3 class="text-lg font-medium text-gray-900 mb-6">Logic Rules</h3>
            <div class="space-y-4">
              <p class="text-base text-gray-600">No logic rules configured yet.</p>
              <button class="px-4 py-2 text-base text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors">
                + Add Logic Rule
              </button>
            </div>
          </div>
          
          <!-- Danger Zone -->
          <div x-show="settingsSection === 'danger'" x-transition>
            <h3 class="text-lg font-medium text-red-900 mb-6">Danger Zone</h3>
            <div class="space-y-4">
              <div class="p-5 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Archive Survey</h4>
                <p class="text-base text-gray-600 mb-4">Archive this survey and hide it from your active surveys list.</p>
                <button class="px-4 py-2 text-base text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Archive Survey
                </button>
              </div>
              <div class="p-5 border border-red-200 rounded-lg bg-red-50">
                <h4 class="font-medium text-gray-900 mb-2">Delete Survey</h4>
                <p class="text-base text-gray-600 mb-4">Permanently delete this survey and all its responses. This action cannot be undone.</p>
                <button class="px-4 py-2 text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Delete Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}