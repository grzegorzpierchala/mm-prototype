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
           'expanded': $store.ui.versionHistoryOpen && $store.versions.leftVersion !== $store.versions.rightVersion
         }">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-200 bg-white sticky top-0 z-20">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Version History</h2>
          <button @click="$store.ui.versionHistoryOpen = false"
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Version Selectors and Controls -->
        <div class="space-y-4">
          <!-- Version Dropdowns -->
          <div class="flex items-center gap-3">
            <!-- Left Version Dropdown -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">Compare Version</label>
              <select x-model="$store.versions.leftVersion"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <template x-for="version in $store.versions.history" :key="version.id">
                  <option :value="version.id" x-text="'Version ' + version.version + ' - ' + new Date(version.timestamp).toLocaleDateString() + ' - ' + version.author"></option>
                </template>
              </select>
            </div>
            
            <!-- Comparison Arrow -->
            <div class="flex items-end pb-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            </div>
            
            <!-- Right Version Dropdown -->
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-600 mb-1">With Version</label>
              <select x-model="$store.versions.rightVersion"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <template x-for="version in $store.versions.history" :key="version.id">
                  <option :value="version.id" x-text="'Version ' + version.version + ' - ' + new Date(version.timestamp).toLocaleDateString() + ' - ' + version.author + (version.isCurrent ? ' (Current)' : '')"></option>
                </template>
              </select>
            </div>
          </div>
          
          <!-- Controls Row -->
          <div class="flex items-center justify-between">
            <!-- Diff Toggle -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <span class="text-sm font-medium text-gray-700">Show differences</span>
                <div class="relative inline-flex items-center">
                  <input type="checkbox" 
                         id="showVisualDiff" 
                         x-model="$store.versions.showDiffHighlights"
                         class="sr-only">
                  <div class="toggle-switch" 
                       :class="{ 'bg-indigo-600': $store.versions.showDiffHighlights, 'bg-gray-300': !$store.versions.showDiffHighlights }">
                    <span class="toggle-switch-handle" 
                          :class="{ 'translate-x-5': $store.versions.showDiffHighlights, 'translate-x-0': !$store.versions.showDiffHighlights }"></span>
                  </div>
                </div>
              </label>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <button x-show="!$store.versions.getVersion($store.versions.rightVersion)?.isCurrent"
                      @click="if(confirm('Restore this version? This will create a new version.')) { $store.versions.restoreVersion($store.versions.rightVersion) }"
                      class="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Restore Right Version
              </button>
            </div>
          </div>
          
          <!-- Diff Legend -->
          <div x-show="$store.versions.showDiffHighlights" 
               x-transition
               class="flex items-center gap-6 text-sm pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-100 border border-green-400 rounded-sm"></div>
              <span class="text-gray-600 font-medium">Added</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-100 border border-blue-400 rounded-sm"></div>
              <span class="text-gray-600 font-medium">Modified</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-100 border border-red-400 rounded-sm opacity-70"></div>
              <span class="text-gray-600 font-medium">Removed</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Area - Full Width Comparison -->
      <div class="flex-1 bg-gray-50 overflow-hidden">
        <!-- Preview Header -->
        <div class="px-8 py-6 border-b border-gray-200 bg-white">
          <h3 class="text-lg font-semibold text-gray-900">Visual Comparison</h3>
          <p class="text-sm text-gray-600 mt-1">Compare changes between versions side by side</p>
        </div>
        
        <!-- Split Screen Preview -->
        <div class="version-preview-container gap-6">
          <!-- Left Version Pane -->
          <div class="version-preview-pane" x-ref="leftVersionPane">
            <div class="version-preview-header px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">
                    Version <span x-text="$store.versions.getVersion($store.versions.leftVersion)?.version || ''"></span>
                  </span>
                  <span x-show="$store.versions.getVersion($store.versions.leftVersion)?.isCurrent" 
                        class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">Current</span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900" x-text="$store.versions.getVersion($store.versions.leftVersion)?.author || ''"></div>
                  <div class="text-xs text-gray-500" 
                       x-text="$store.versions.getVersion($store.versions.leftVersion) ? new Date($store.versions.getVersion($store.versions.leftVersion).timestamp).toLocaleString('en-US', { 
                         month: 'short', 
                         day: 'numeric', 
                         hour: 'numeric', 
                         minute: '2-digit' 
                       }) : ''"></div>
                </div>
              </div>
            </div>
            <div class="px-10 py-10 overflow-y-auto version-preview-content"
                 @scroll="if($refs.rightVersionPane) { 
                   const targetScroll = $refs.rightVersionPane.querySelector('.version-preview-content');
                   if(targetScroll && !$el._isScrolling) {
                     targetScroll._isScrolling = true;
                     targetScroll.scrollTop = $event.target.scrollTop;
                     setTimeout(() => targetScroll._isScrolling = false, 10);
                   }
                 }">
              <!-- Survey Preview -->
              <div class="mb-12">
                <h1 class="text-2xl font-semibold text-gray-900 mb-6" 
                    x-text="$store.versions.getVersion($store.versions.leftVersion)?.surveySnapshot?.title || ''"></h1>
                <p class="text-base text-gray-600 whitespace-pre-wrap leading-7" 
                   x-text="$store.versions.getVersion($store.versions.leftVersion)?.surveySnapshot?.description || ''"></p>
              </div>
              
              <!-- Questions with diff indicators -->
              <div class="space-y-8">
                <template x-for="question in ($store.versions.getVersion($store.versions.leftVersion)?.surveySnapshot?.questions || [])" :key="question.id">
                  <div class="p-8 bg-white rounded-lg border-2 transition-all duration-200"
                       :class="{
                         'border-gray-200': !$store.versions.showDiffHighlights || !$store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion),
                         'border-red-400 bg-red-50 opacity-75': $store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'removed',
                         'border-blue-400 bg-blue-50': $store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'modified'
                       }">
                    <div class="flex items-start justify-between mb-3">
                      <h3 class="font-medium text-gray-900">
                        <span x-text="question.questionNumber"></span>: 
                        <span x-text="question.text"></span>
                        <span x-show="question.required" class="text-red-500 ml-1">*</span>
                      </h3>
                      <span x-show="$store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion)"
                            class="text-xs font-medium px-2 py-1 rounded-full"
                            :class="{
                              'bg-red-100 text-red-700': $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'removed',
                              'bg-blue-100 text-blue-700': $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'modified'
                            }"
                            x-text="$store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion)"></span>
                    </div>
                        
                        <!-- Question type specific preview -->
                        <div x-show="question.type === 'multiple_choice'" class="space-y-2">
                          <template x-for="option in question.options" :key="option.id">
                            <label class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                              <input type="radio" :name="'current-' + question.id" class="mr-3 text-indigo-600"> 
                              <span x-text="option.text" class="text-gray-700"></span>
                            </label>
                          </template>
                        </div>
                        
                        <div x-show="question.type === 'dropdown'" class="mt-2">
                          <select class="w-full p-2 border border-gray-200 rounded-lg">
                            <option value="">Select an option</option>
                            <template x-for="option in question.options" :key="option.id">
                              <option x-text="option.text"></option>
                            </template>
                          </select>
                        </div>
                        
                        <div x-show="question.type === 'text_input'">
                          <textarea x-show="question.settings?.inputType === 'textarea'"
                                    class="w-full p-2 border border-gray-200 rounded-lg" 
                                    :placeholder="question.settings?.placeholder || ''"
                                    :rows="question.settings?.rows || 4"></textarea>
                          <input x-show="question.settings?.inputType !== 'textarea'"
                                 :type="question.settings?.inputType || 'text'"
                                 class="w-full p-2 border border-gray-200 rounded-lg" 
                                 :placeholder="question.settings?.placeholder || ''">
                        </div>
                        
                        <div x-show="question.type === 'rating'" class="mt-2">
                          <div class="flex gap-2">
                            <template x-for="i in (question.settings?.scale || 5)" :key="i">
                              <button class="w-10 h-10 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors" x-text="i"></button>
                            </template>
                          </div>
                        </div>
                        
                        <div x-show="question.type === 'nps'" class="mt-2">
                          <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-600">Not likely</span>
                            <div class="flex gap-1">
                              <template x-for="i in 11" :key="i">
                                <button class="w-8 h-8 border border-gray-200 rounded text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors" 
                                        :class="i <= 7 ? 'hover:bg-red-50' : i <= 9 ? 'hover:bg-yellow-50' : 'hover:bg-green-50'"
                                        x-text="i-1"></button>
                              </template>
                            </div>
                            <span class="text-sm text-gray-600">Very likely</span>
                          </div>
                        </div>
                        
                        <div x-show="question.type === 'email'" class="mt-2">
                          <input type="email" 
                                 class="w-full p-2 border border-gray-200 rounded-lg" 
                                 :placeholder="question.settings?.placeholder || 'your@email.com'">
                        </div>
                        
                        <div x-show="question.type === 'phone'" class="mt-2">
                          <input type="tel" 
                                 class="w-full p-2 border border-gray-200 rounded-lg" 
                                 :placeholder="question.settings?.placeholder || '(555) 123-4567'">
                        </div>
                        
                        <div x-show="question.type === 'date'" class="mt-2">
                          <input type="date" 
                                 class="w-full p-2 border border-gray-200 rounded-lg">
                        </div>
                        
                        <div x-show="question.type === 'checkbox'" class="space-y-2">
                          <template x-for="option in question.options" :key="option.id">
                            <label class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                              <input type="checkbox" class="mr-3 text-indigo-600"> 
                              <span x-text="option.text" class="text-gray-700"></span>
                            </label>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              
          <!-- Right Version Pane -->
          <div class="version-preview-pane" x-ref="rightVersionPane">
            <div class="version-preview-header px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">
                    Version <span x-text="$store.versions.getVersion($store.versions.rightVersion)?.version || ''"></span>
                  </span>
                  <span x-show="$store.versions.getVersion($store.versions.rightVersion)?.isCurrent" 
                        class="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full font-medium">Current</span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900" x-text="$store.versions.getVersion($store.versions.rightVersion)?.author || ''"></div>
                  <div class="text-xs text-gray-500" 
                       x-text="$store.versions.getVersion($store.versions.rightVersion) ? new Date($store.versions.getVersion($store.versions.rightVersion).timestamp).toLocaleString('en-US', { 
                         month: 'short', 
                         day: 'numeric', 
                         hour: 'numeric', 
                         minute: '2-digit' 
                       }) : ''"></div>
                </div>
              </div>
            </div>
            <div class="px-10 py-10 overflow-y-auto version-preview-content"
                 @scroll="if($refs.leftVersionPane) { 
                   const targetScroll = $refs.leftVersionPane.querySelector('.version-preview-content');
                   if(targetScroll && !$el._isScrolling) {
                     targetScroll._isScrolling = true;
                     targetScroll.scrollTop = $event.target.scrollTop;
                     setTimeout(() => targetScroll._isScrolling = false, 10);
                   }
                 }">
              <!-- Survey Preview -->
              <div class="mb-12">
                <h1 class="text-2xl font-semibold text-gray-900 mb-6" 
                    x-text="$store.versions.getVersion($store.versions.rightVersion)?.surveySnapshot?.title || ''"></h1>
                <p class="text-base text-gray-600 whitespace-pre-wrap leading-7" 
                   x-text="$store.versions.getVersion($store.versions.rightVersion)?.surveySnapshot?.description || ''"></p>
              </div>
              
              <!-- Questions with diff indicators -->
              <div class="space-y-8">
                <template x-for="question in ($store.versions.getVersion($store.versions.rightVersion)?.surveySnapshot?.questions || [])" :key="question.id">
                  <div class="p-8 bg-white rounded-lg border-2 transition-all duration-200"
                       :class="{
                         'border-gray-200': !$store.versions.showDiffHighlights || !$store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion),
                         'border-green-400 bg-green-50': $store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'added',
                         'border-blue-400 bg-blue-50': $store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'modified'
                       }">
                    <div class="flex items-start justify-between mb-3">
                      <h3 class="font-medium text-gray-900">
                        <span x-text="question.questionNumber"></span>: 
                        <span x-text="question.text"></span>
                        <span x-show="question.required" class="text-red-500 ml-1">*</span>
                      </h3>
                      <span x-show="$store.versions.showDiffHighlights && $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion)"
                            class="text-xs font-medium px-2 py-1 rounded-full"
                            :class="{
                              'bg-green-100 text-green-700': $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'added',
                              'bg-blue-100 text-blue-700': $store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion) === 'modified'
                            }"
                            x-text="$store.versions.getQuestionDiffStatusBetween(question.id, $store.versions.leftVersion, $store.versions.rightVersion)"></span>
                    </div>
                        
                        <!-- Question type specific preview -->
                        <div x-show="!question._removed">
                          <div x-show="question.type === 'multiple_choice'" class="space-y-2">
                            <template x-for="option in question.options" :key="option.id">
                              <label class="flex items-center p-2 rounded"
                                     :class="question._removed ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'">
                                <input type="radio" :name="'selected-' + question.id" class="mr-3 text-indigo-600" :disabled="question._removed"> 
                                <span x-text="option.text" class="text-gray-700"></span>
                              </label>
                            </template>
                          </div>
                          
                          <div x-show="question.type === 'dropdown'" class="mt-2">
                            <select class="w-full p-2 border border-gray-200 rounded-lg" :disabled="question._removed">
                              <option value="">Select an option</option>
                              <template x-for="option in question.options" :key="option.id">
                                <option x-text="option.text"></option>
                              </template>
                            </select>
                          </div>
                          
                          <div x-show="question.type === 'text_input'">
                            <textarea x-show="question.settings?.inputType === 'textarea'"
                                      class="w-full p-2 border border-gray-200 rounded-lg" 
                                      :placeholder="question.settings?.placeholder || ''"
                                      :rows="question.settings?.rows || 4"
                                      :disabled="question._removed"></textarea>
                            <input x-show="question.settings?.inputType !== 'textarea'"
                                   :type="question.settings?.inputType || 'text'"
                                   class="w-full p-2 border border-gray-200 rounded-lg" 
                                   :placeholder="question.settings?.placeholder || ''"
                                   :disabled="question._removed">
                          </div>
                          
                          <div x-show="question.type === 'rating'" class="mt-2">
                            <div class="flex gap-2">
                              <template x-for="i in (question.settings?.scale || 5)" :key="i">
                                <button class="w-10 h-10 border border-gray-200 rounded-lg"
                                        :class="question._removed ? 'opacity-50' : 'hover:bg-indigo-50 hover:border-indigo-300 transition-colors'"
                                        :disabled="question._removed" 
                                        x-text="i"></button>
                              </template>
                            </div>
                          </div>
                          
                          <div x-show="question.type === 'nps'" class="mt-2">
                            <div class="flex items-center gap-2">
                              <span class="text-sm text-gray-600">Not likely</span>
                              <div class="flex gap-1">
                                <template x-for="i in 11" :key="i">
                                  <button class="w-8 h-8 border border-gray-200 rounded text-sm"
                                          :class="question._removed ? 'opacity-50' : i <= 7 ? 'hover:bg-red-50' : i <= 9 ? 'hover:bg-yellow-50' : 'hover:bg-green-50'"
                                          :disabled="question._removed" 
                                          x-text="i-1"></button>
                                </template>
                              </div>
                              <span class="text-sm text-gray-600">Very likely</span>
                            </div>
                          </div>
                          
                          <div x-show="question.type === 'email'" class="mt-2">
                            <input type="email" 
                                   class="w-full p-2 border border-gray-200 rounded-lg" 
                                   :placeholder="question.settings?.placeholder || 'your@email.com'"
                                   :disabled="question._removed">
                          </div>
                          
                          <div x-show="question.type === 'phone'" class="mt-2">
                            <input type="tel" 
                                   class="w-full p-2 border border-gray-200 rounded-lg" 
                                   :placeholder="question.settings?.placeholder || '(555) 123-4567'"
                                   :disabled="question._removed">
                          </div>
                          
                          <div x-show="question.type === 'date'" class="mt-2">
                            <input type="date" 
                                   class="w-full p-2 border border-gray-200 rounded-lg"
                                   :disabled="question._removed">
                          </div>
                          
                          <div x-show="question.type === 'checkbox'" class="space-y-2">
                            <template x-for="option in question.options" :key="option.id">
                              <label class="flex items-center p-2 rounded"
                                     :class="question._removed ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'">
                                <input type="checkbox" class="mr-3 text-indigo-600" :disabled="question._removed"> 
                                <span x-text="option.text" class="text-gray-700"></span>
                              </label>
                            </template>
                          </div>
                        </div>
                        
                        <!-- Removed question message -->
                        <div x-show="question._removed" class="text-sm text-gray-500 italic">
                          This question was removed in later versions
                        </div>
                      </div>
                    </template>
                    
                    <!-- Show questions that don't exist in this version but exist in current -->
                    <template x-for="question in $store.survey.questions.filter(q => 
                                !($store.versions.getVersion($store.versions.selectedVersion)?.surveySnapshot?.questions || []).some(sq => sq.id === q.id)
                              )" :key="'future-' + question.id">
                      <div x-show="$store.versions.showDiffHighlights"
                           class="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
                        <div class="flex items-center gap-2 text-gray-500">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          <span class="text-sm italic">Question "<span x-text="question.text"></span>" will be added in later versions</span>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}