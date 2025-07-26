// Version History Panel Component
export function VersionHistory() {
  return `
    <!-- Version History Panel -->
    <div x-show="$store.ui.versionHistoryOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="transform translate-x-full"
         x-transition:enter-end="transform translate-x-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="transform translate-x-0"
         x-transition:leave-end="transform translate-x-full"
         @click.away="$store.ui.versionHistoryOpen = false"
         class="version-history-panel"
         :class="{ 
           'open': $store.ui.versionHistoryOpen,
           'expanded': $store.versions.compareMode 
         }">
      
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 bg-white sticky top-0 z-20">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Version History</h2>
          <button @click="$store.ui.versionHistoryOpen = false"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Compare Mode Toggle -->
        <div x-show="$store.versions.selectedVersion && !$store.versions.compareMode" 
             class="version-comparison-toggle">
          <input type="checkbox" 
                 id="compareToggle"
                 @change="$store.versions.toggleCompareMode($store.versions.selectedVersion)">
          <label for="compareToggle" class="text-sm font-medium text-gray-700">
            Compare with current version
          </label>
        </div>
        
        <!-- Visual Diff Toggle -->
        <div x-show="$store.versions.compareMode" 
             class="version-comparison-toggle">
          <input type="checkbox" 
                 id="visualDiffToggle"
                 x-model="$store.versions.showVisualDiff">
          <label for="visualDiffToggle" class="text-sm font-medium text-gray-700">
            Show visual differences
          </label>
          <button @click="$store.versions.toggleCompareMode()"
                  class="ml-auto text-sm text-indigo-600 hover:text-indigo-700">
            Exit comparison
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Normal Mode - Version List -->
        <div x-show="!$store.versions.compareMode" class="p-6">
          <div class="space-y-6">
            <template x-for="version in $store.versions.history" :key="version.id">
              <div class="version-item" 
                   :class="{ 'current': version.isCurrent }"
                   @click="$store.versions.selectedVersion = version.id">
                <!-- Version Dot -->
                <div class="version-dot"></div>
                
                <!-- Version Content -->
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h3 class="font-medium text-gray-900">
                        Version <span x-text="version.version"></span>
                        <span x-show="version.isCurrent" 
                              class="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Current
                        </span>
                      </h3>
                      <p class="text-sm text-gray-500 mt-1" x-text="version.message"></p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-gray-900" x-text="version.author"></p>
                      <p class="text-xs text-gray-500" 
                         x-text="new Date(version.timestamp).toLocaleString('en-US', { 
                           month: 'short', 
                           day: 'numeric', 
                           year: 'numeric',
                           hour: 'numeric', 
                           minute: '2-digit' 
                         })">
                      </p>
                    </div>
                  </div>
                  
                  <!-- Changes Summary -->
                  <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
                      </svg>
                      <span x-text="version.changes.filter(c => c.type === 'added').length"></span> added
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clip-rule="evenodd"/>
                      </svg>
                      <span x-text="version.changes.filter(c => c.type === 'modified').length"></span> modified
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      <span x-text="version.changes.filter(c => c.type === 'removed').length"></span> removed
                    </span>
                  </div>
                  
                  <!-- Detailed Changes -->
                  <div x-show="$store.versions.selectedVersion === version.id" 
                       x-transition
                       class="space-y-2">
                    <template x-for="change in version.changes" :key="change.text">
                      <div class="change-item"
                           :class="{
                             'change-added': change.type === 'added',
                             'change-modified': change.type === 'modified',
                             'change-removed': change.type === 'removed'
                           }"
                           @mouseenter="$store.versions.hoveredChange = change"
                           @mouseleave="$store.versions.hoveredChange = null">
                        <span class="font-medium" x-text="change.type.charAt(0).toUpperCase() + change.type.slice(1)"></span>
                        <span x-text="change.item"></span>:
                        <span x-text="change.text"></span>
                      </div>
                    </template>
                    
                    <!-- Version Actions -->
                    <div x-show="!version.isCurrent" class="mt-4 flex gap-2">
                      <button @click="$store.versions.toggleCompareMode(version.id)"
                              class="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Compare with current
                      </button>
                      <button @click="if(confirm('Restore this version? This will create a new version.')) { $store.versions.restoreVersion(version.id) }"
                              class="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                        Restore this version
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Compare Mode - Side by Side -->
        <div x-show="$store.versions.compareMode" class="p-6">
          <div class="version-preview-container">
            <!-- Left Side - Selected Version -->
            <div class="version-preview-pane">
              <div class="version-preview-header">
                <h3 class="font-medium">
                  Version <span x-text="$store.versions.getVersion($store.versions.compareVersion)?.version"></span>
                </h3>
                <p class="text-sm text-gray-500" 
                   x-text="new Date($store.versions.getVersion($store.versions.compareVersion)?.timestamp).toLocaleDateString()">
                </p>
              </div>
              <div class="p-4">
                <!-- Preview of selected version questions -->
                <div class="space-y-4">
                  <template x-for="(change, index) in $store.versions.getVersion($store.versions.compareVersion)?.changes" :key="index">
                    <div x-show="change.item === 'question'"
                         class="p-4 border rounded-lg"
                         :class="{
                           'diff-highlight-removed': change.type === 'removed' && $store.versions.showVisualDiff,
                           'diff-highlight-modified': change.type === 'modified' && $store.versions.showVisualDiff
                         }">
                      <p class="font-medium" x-text="change.text"></p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            
            <!-- Right Side - Current Version -->
            <div class="version-preview-pane">
              <div class="version-preview-header">
                <h3 class="font-medium">Current Version</h3>
                <p class="text-sm text-gray-500">Now</p>
              </div>
              <div class="p-4">
                <!-- Preview of current questions -->
                <div class="space-y-4">
                  <template x-for="question in $store.survey.questions" :key="question.id">
                    <div class="p-4 border rounded-lg"
                         :class="{
                           'diff-highlight-added': $store.versions.showVisualDiff
                         }">
                      <p class="font-medium">
                        <span x-text="question.questionNumber"></span>:
                        <span x-text="question.text"></span>
                      </p>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Diff Summary -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Summary of changes</h4>
            <div class="space-y-1 text-sm">
              <p class="text-green-600">
                <span class="font-medium">+</span> 
                <span x-text="$store.versions.getChangesSummary($store.versions.compareVersion)?.added || 0"></span> additions
              </p>
              <p class="text-blue-600">
                <span class="font-medium">~</span> 
                <span x-text="$store.versions.getChangesSummary($store.versions.compareVersion)?.modified || 0"></span> modifications
              </p>
              <p class="text-red-600">
                <span class="font-medium">-</span> 
                <span x-text="$store.versions.getChangesSummary($store.versions.compareVersion)?.removed || 0"></span> deletions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Change Preview Tooltip -->
    <div x-show="$store.versions.hoveredChange"
         x-transition
         class="change-preview-tooltip"
         :class="{ 'show': $store.versions.hoveredChange }"
         :style="{ 
           position: 'fixed',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)'
         }">
      <template x-if="$store.versions.hoveredChange">
        <div>
          <h4 class="font-medium text-sm mb-2" x-text="$store.versions.hoveredChange?.type === 'modified' ? 'Changes:' : $store.versions.hoveredChange?.type"></h4>
          <div x-show="$store.versions.hoveredChange?.type === 'modified'">
            <div class="change-preview-before">
              <span class="text-xs font-medium">Before:</span>
              <p class="text-sm">Previous question text would be shown here</p>
            </div>
            <div class="change-preview-after">
              <span class="text-xs font-medium">After:</span>
              <p class="text-sm" x-text="$store.versions.hoveredChange?.text"></p>
            </div>
          </div>
          <div x-show="$store.versions.hoveredChange?.type !== 'modified'">
            <p class="text-sm" x-text="$store.versions.hoveredChange?.text"></p>
          </div>
        </div>
      </template>
    </div>
  `
}