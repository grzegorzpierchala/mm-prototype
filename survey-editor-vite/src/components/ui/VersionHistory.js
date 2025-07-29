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
        
        <!-- Visual Comparison Toggle -->
        <div class="version-comparison-toggle">
          <input type="checkbox" 
                 id="showVisualDiff" 
                 x-model="$store.versions.showVisualDiff"
                 @change="if($event.target.checked && !$store.versions.selectedVersion) { 
                   alert('Please select a version to compare first'); 
                   $event.target.checked = false; 
                   $store.versions.showVisualDiff = false;
                 }">
          <label for="showVisualDiff" class="text-gray-700 select-none cursor-pointer">
            Show changes in preview
          </label>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Version Timeline (Always visible, width changes based on showVisualDiff) -->
        <div class="overflow-y-auto p-6 relative" 
             :class="$store.versions.showVisualDiff ? 'w-96 border-r border-gray-200' : 'flex-1'"
             style="padding-bottom: 200px; overflow-x: visible;">
          <div class="space-y-6">
            <template x-for="version in $store.versions.history" :key="version.id">
              <div class="version-item" 
                   :class="{ 'current': version.isCurrent }"
                   @click="$store.versions.selectedVersion = version.id">
                <!-- Version Dot -->
                <div class="version-dot"></div>
                
                <!-- Version Content -->
                <div class="flex-1">
                  <div class="version-content p-4 -mx-4">
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
                    <template x-for="(change, index) in version.changes" :key="change.text">
                      <div class="change-item relative cursor-pointer"
                           :class="{
                             'change-added': change.type === 'added',
                             'change-modified': change.type === 'modified',
                             'change-removed': change.type === 'removed'
                           }"
                           @mouseenter="$store.versions.hoveredChange = change.id || change.text"
                           @mouseleave="$store.versions.hoveredChange = null">
                        <span class="font-medium">
                          <span x-text="change.type === 'added' ? '+' : change.type === 'modified' ? '~' : '-'"></span>
                          <span x-text="change.type.charAt(0).toUpperCase() + change.type.slice(1)"></span>:
                        </span>
                        <span x-text="change.text"></span>
                        
                        <!-- Hover Preview -->
                        <div x-show="$store.versions.hoveredChange === (change.id || change.text)" 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 transform scale-95"
                             x-transition:enter-end="opacity-100 transform scale-100"
                             class="change-preview-tooltip show absolute left-0 top-full mt-1 w-64 z-[100]">
                          <h4 class="font-medium text-sm mb-2">Preview:</h4>
                          <div x-show="change.type === 'modified' && change.oldText">
                            <div class="change-preview-before">
                              <p class="text-sm" x-text="change.oldText || 'Previous value'"></p>
                            </div>
                            <div class="text-center text-gray-400 text-xs my-1">↓</div>
                            <div class="change-preview-after">
                              <p class="text-sm" x-text="change.newText || change.text"></p>
                            </div>
                          </div>
                          <div x-show="change.type !== 'modified' || !change.oldText">
                            <div :class="change.type === 'added' ? 'change-preview-after' : 'change-preview-before'">
                              <p class="text-sm" x-text="change.text"></p>
                            </div>
                          </div>
                        </div>
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
              </div>
            </template>
          </div>
        </div>
        
        <!-- Visual Diff Preview -->
        <div x-show="$store.versions.showVisualDiff" 
             x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             class="flex-1 bg-gray-50 p-6">
          <div x-show="$store.versions.selectedVersion" class="h-full">
            <!-- Preview Header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Visual Comparison</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded">Added</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded">Modified</span>
                <span class="px-2 py-1 bg-red-100 text-red-700 rounded">Removed</span>
              </div>
            </div>
            
            <!-- Split Screen Preview -->
            <div class="version-preview-container">
              <!-- Current Version -->
              <div class="version-preview-pane">
                <div class="version-preview-header">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">Current Version</span>
                    <span class="text-sm text-gray-500" x-text="'v' + $store.versions.currentVersion"></span>
                  </div>
                </div>
                <div class="p-6">
                  <!-- Survey Preview -->
                  <div class="mb-6">
                    <h1 class="text-2xl font-bold text-gray-900" x-text="$store.survey.title"></h1>
                    <p class="mt-2 text-gray-600" x-text="$store.survey.description"></p>
                  </div>
                  
                  <!-- Questions with diff indicators -->
                  <div class="space-y-4">
                    <template x-for="question in $store.survey.questions" :key="question.id">
                      <div class="p-4 bg-white rounded-lg border border-gray-200"
                           :class="{
                             'diff-highlight-added': $store.versions.isQuestionNew && $store.versions.isQuestionNew(question.id),
                             'diff-highlight-modified': $store.versions.isQuestionModified && $store.versions.isQuestionModified(question.id)
                           }">
                        <h3 class="font-medium mb-3">
                          <span x-text="question.questionNumber"></span>: 
                          <span x-text="question.text"></span>
                        </h3>
                        
                        <!-- Question type specific preview -->
                        <div x-show="question.type === 'multiple_choice'" class="space-y-2">
                          <template x-for="option in question.options" :key="option.id">
                            <label class="flex items-center">
                              <input type="radio" :name="'preview-' + question.id" class="mr-2"> 
                              <span x-text="option.text"></span>
                            </label>
                          </template>
                        </div>
                        
                        <div x-show="question.type === 'text_input'">
                          <textarea class="w-full p-2 border border-gray-200 rounded" 
                                    :placeholder="question.settings.placeholder"
                                    :rows="question.settings.rows || 4"></textarea>
                        </div>
                        
                        <div x-show="question.type === 'rating'">
                          <div class="flex gap-2">
                            <template x-for="i in 5">
                              <button class="p-2 border border-gray-200 rounded hover:bg-gray-50" x-text="i"></button>
                            </template>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              
              <!-- Selected Version -->
              <div class="version-preview-pane">
                <div class="version-preview-header">
                  <div class="flex items-center justify-between">
                    <span class="font-medium">
                      Version <span x-text="$store.versions.getVersion($store.versions.selectedVersion)?.version"></span>
                    </span>
                    <span class="text-sm text-gray-500" 
                          x-text="new Date($store.versions.getVersion($store.versions.selectedVersion)?.timestamp).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })">
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <!-- Survey Preview - Previous Version -->
                  <div class="mb-6">
                    <h1 class="text-2xl font-bold text-gray-900"
                        :class="{ 'diff-highlight-modified': $store.versions.getVersion($store.versions.selectedVersion)?.changes.some(c => c.item === 'title') }">
                      <span x-text="$store.versions.getVersion($store.versions.selectedVersion)?.surveySnapshot?.title || 'Customer Satisfaction Survey'"></span>
                    </h1>
                    <p class="mt-2 text-gray-600" 
                       x-text="$store.versions.getVersion($store.versions.selectedVersion)?.surveySnapshot?.description || 'Help us improve your experience'"></p>
                  </div>
                  
                  <!-- Questions from snapshot or recreated from changes -->
                  <div class="space-y-4">
                    <div class="p-4 bg-white rounded-lg border border-gray-200 diff-highlight-removed"
                         x-show="$store.versions.getVersion($store.versions.selectedVersion)?.changes.some(c => c.type === 'removed')">
                      <h3 class="font-medium mb-3">Q2: Previous question that was removed</h3>
                      <p class="text-sm text-gray-600">This question has been removed in the current version</p>
                    </div>
                    
                    <template x-for="change in $store.versions.getVersion($store.versions.selectedVersion)?.changes.filter(c => c.item === 'question')" :key="change.text">
                      <div class="p-4 bg-white rounded-lg border border-gray-200"
                           :class="{
                             'diff-highlight-modified': change.type === 'modified',
                             'diff-highlight-removed': change.type === 'removed'
                           }">
                        <h3 class="font-medium mb-3" x-text="change.text"></h3>
                        <p class="text-sm text-gray-600" x-text="'Change type: ' + change.type"></p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No Version Selected -->
          <div x-show="!$store.versions.selectedVersion" class="h-full flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-gray-500">Select a version from the timeline to preview changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}