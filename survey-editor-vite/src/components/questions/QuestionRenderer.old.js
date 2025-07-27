// Question Renderer - Enhanced template for rendering all question types with variations
export function QuestionRenderer() {
  return `
    <div class="question-blocks-container space-y-4"
         x-data="{
           handleQuestionSort(item, position) {
             console.log('Question reordered:', item, 'to position', position);
             const questions = [...$store.survey.questions];
             const oldIndex = questions.findIndex(q => q.id === item);
             if (oldIndex !== -1 && oldIndex !== position) {
               const [movedQuestion] = questions.splice(oldIndex, 1);
               questions.splice(position, 0, movedQuestion);
               $store.survey.questions = questions;
               $store.ui.debouncedAutoSave();
             }
           }
         }"
         x-sort="handleQuestionSort"
         x-sort:config="{ 
           handle: '.block-handle',
           animation: 150,
           ghostClass: 'sortable-ghost',
           dragClass: 'sortable-drag',
           chosenClass: 'sortable-chosen',
           onStart: function(evt) {
             evt.from.classList.add('sortable-dragging');
             document.body.style.userSelect = 'none';
             document.body.style.webkitUserSelect = 'none';
           },
           onEnd: function(evt) {
             evt.from.classList.remove('sortable-dragging');
             document.body.style.userSelect = '';
             document.body.style.webkitUserSelect = '';
           }
         }">
    <template x-for="(question, index) in $store.survey.questions" :key="question.id">
      <div class="block group relative bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all"
           :class="$store.ui.selectedQuestionId === question.id && $store.ui.settingsPanelOpen ? 'ring-2 ring-indigo-500 shadow-sm' : ''"
           :data-question-id="question.id"
           x-sort:item="question.id">
        
        <!-- Drag Handle -->
        <div class="block-handle absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="text-gray-400 hover:text-gray-600 cursor-move p-1 hover:bg-gray-100 rounded">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
            </div>
        </div>
        
        <!-- Comment Indicator -->
        <div class="comment-indicator"
             :class="{ 
                 'has-comments': $store.comment.getCommentCount(question.id) > 0
             }"
             @click="$store.comment.toggleCommentThread(question.id)">
            <div class="comment-bubble"
                 :class="{ 
                     'has-comments': $store.comment.getCommentCount(question.id) > 0,
                     'has-unresolved': $store.comment.hasUnresolvedComments(question.id)
                 }">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                </svg>
                <span x-show="$store.comment.getCommentCount(question.id) > 0" 
                      class="comment-count" 
                      x-text="$store.comment.getCommentCount(question.id)"></span>
            </div>
        </div>
        
        <!-- Question Content -->
        <div class="p-6" @click="$store.ui.openSettingsPanel(question.id)">
            <!-- Question Type Badge and Question Number Container -->
            <div class="flex items-center gap-3 mb-4">
                <!-- Question Type Badge and Dropdown Container -->
                <div class="relative inline-block">
                        <button @click.stop="showQuestionTypes = showQuestionTypes === question.id ? null : question.id"
                                @keydown.escape="showQuestionTypes = null"
                                class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full transition-all"
                                :class="showQuestionTypes === question.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'">
                            <span x-text="question.type.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())"></span>
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <!-- Ultra-thin Question Type Dropdown -->
                        <div x-show="showQuestionTypes === question.id" 
                             x-transition:enter="transition ease-out duration-200"
                             x-transition:enter-start="opacity-0 scale-95"
                             x-transition:enter-end="opacity-100 scale-100"
                             @click.away="showQuestionTypes = null"
                             @keydown.escape="showQuestionTypes = null"
                             class="question-type-dropdown">
                            
                            <div class="question-type-dropdown-content">
                                <!-- Recently Used (if available) -->
                                <div x-show="recentlyUsedTypes.length > 0" class="question-type-section">
                                    <template x-for="type in recentlyUsedTypes" :key="'recent-' + type.id">
                                        <button class="question-type-item"
                                                :class="{ 'highlighted': isTypeHighlighted('recent-' + type.id) }"
                                                @click="changeQuestionType(question.id, type.id)"
                                                @mouseenter="setHighlightedType('recent-' + type.id)">
                                            <span class="question-type-item-icon" x-text="type.icon"></span>
                                            <span class="question-type-item-name" x-text="type.name"></span>
                                            <span class="question-type-star">★</span>
                                        </button>
                                    </template>
                                </div>
                                
                                <!-- Main question types -->
                                <template x-for="(category, categoryName) in getQuestionTypeCategories()" :key="categoryName">
                                    <div x-show="category.length > 0" class="question-type-section">
                                        <div class="question-type-section-title" x-text="categoryName.charAt(0).toUpperCase() + categoryName.slice(1)"></div>
                                        <template x-for="type in category" :key="type.id">
                                            <button class="question-type-item"
                                                    :class="{ 'highlighted': isTypeHighlighted(categoryName + '-' + type.id) }"
                                                    @click="changeQuestionType(question.id, type.id)"
                                                    @mouseenter="setHighlightedType(categoryName + '-' + type.id)">
                                                <span class="question-type-item-icon" x-text="type.icon"></span>
                                                <span class="question-type-item-name" x-text="type.name"></span>
                                            </button>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                </div>
                
                <!-- Question Number -->
                <input type="text" 
                       x-model="question.questionNumber"
                       @click.stop
                       @input="validateQuestionNumber(question.id); debouncedAutosave()"
                       @blur="validateQuestionNumber(question.id)"
                       class="flex-1 text-base font-medium text-gray-500 bg-transparent border-0 focus:bg-gray-50 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       :class="{'text-red-500': !isQuestionNumberValid(question.id)}"
                       placeholder="Q1, A1, 1.1, etc."
                       title="Question number for research purposes">
            </div>
            
            <!-- Question Text -->
            <input type="text" 
                   x-model="question.text"
                   @click.stop
                   @input="debouncedAutosave"
                   class="text-lg font-medium text-gray-900 mb-4 w-full bg-transparent border-0 focus:bg-gray-50 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   placeholder="Type your question here...">
            
            <!-- Question Type Specific Content -->
            
            <!-- Multiple Choice -->
            <template x-if="question.type === 'multiple_choice'">
              <div>
                <!-- List Format -->
                <template x-if="question.settings.format === 'list'">
                  <div class="space-y-2"
                       :class="{
                         'flex flex-wrap gap-4': question.settings.layout === 'horizontal',
                         'grid grid-cols-2 gap-3': question.settings.layout === 'columns' && question.settings.columns === 2,
                         'grid grid-cols-3 gap-3': question.settings.layout === 'columns' && question.settings.columns === 3,
                         'grid grid-cols-4 gap-3': question.settings.layout === 'columns' && question.settings.columns === 4
                       }"
                       x-data="{
                         handleOptionSort(item, position) {
                           const questionId = question.id;
                           const questions = [...$store.survey.questions];
                           const qIndex = questions.findIndex(q => q.id === questionId);
                           if (qIndex !== -1 && questions[qIndex].options) {
                             const options = [...questions[qIndex].options];
                             const oldIndex = options.findIndex(o => o.id === item);
                             if (oldIndex !== -1 && oldIndex !== position) {
                               const [movedOption] = options.splice(oldIndex, 1);
                               options.splice(position, 0, movedOption);
                               questions[qIndex].options = options;
                               $store.survey.questions = questions;
                               $store.ui.debouncedAutoSave();
                             }
                           }
                         }
                       }"
                       x-sort="handleOptionSort"
                       x-sort:config="{ 
                         handle: '.option-drag-handle',
                         animation: 150
                       }">
                    <template x-for="(option, optionIndex) in question.options" :key="option.id">
                        <div class="question-option"
                             :data-option-id="option.id"
                             x-sort:item="option.id">
                            <div class="option-drag-handle">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                                </svg>
                            </div>
                            
                            <!-- Radio/Checkbox based on answer type -->
                            <div class="flex-shrink-0">
                              <template x-if="question.settings.answerType === 'single'">
                                <div class="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                              </template>
                              <template x-if="question.settings.answerType === 'multiple'">
                                <div class="w-4 h-4 border-2 border-gray-300 rounded"></div>
                              </template>
                            </div>
                            
                            <!-- Option Text -->
                            <input type="text" 
                                   x-model="option.text"
                                   @click.stop
                                   @input="$store.ui.debouncedAutosave()"
                                   @keydown.enter="addOption(question.id)"
                                   @keydown.backspace="option.text === '' && removeOption(question.id, option.id)"
                                   :data-option-id="option.id"
                                   class="flex-1 px-3 py-1.5 bg-white border-0 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                                   placeholder="Option text...">
                            
                            <!-- Text Entry Option -->
                            <button @click.stop="question.settings.allowTextEntry[option.id] = !question.settings.allowTextEntry[option.id]; $store.ui.debouncedAutoSave()"
                                    class="text-gray-400 hover:text-gray-600 p-1"
                                    title="Allow text entry">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                   :class="{'text-indigo-600': question.settings.allowTextEntry[option.id]}">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            
                            <!-- Remove Option Button -->
                            <button @click.stop="removeOption(question.id, option.id)"
                                    x-show="question.options.length > 2"
                                    class="option-remove">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </template>
                  </div>
                </template>
                
                <!-- Dropdown Format -->
                <template x-if="question.settings.format === 'dropdown'">
                  <select class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" disabled>
                    <option x-text="question.settings.placeholder || 'Select an option...'"></option>
                    <template x-for="option in question.options" :key="option.id">
                      <option x-text="option.text"></option>
                    </template>
                  </select>
                </template>
                
                <!-- Select Box Format -->
                <template x-if="question.settings.format === 'select_box'">
                  <select multiple size="4" class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" disabled>
                    <template x-for="option in question.options" :key="option.id">
                      <option x-text="option.text"></option>
                    </template>
                  </select>
                </template>
                
                <!-- Add Option Button (only for list format) -->
                <button x-show="question.settings.format === 'list'" 
                        @click.stop="addOption(question.id)"
                        class="add-option-button mt-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Add option</span>
                </button>
              </div>
            </template>
            
            <!-- Text Input -->
            <template x-if="question.type === 'text_input'">
              <div>
                <template x-if="question.settings.textType === 'single_line'">
                  <input type="text" 
                         :placeholder="question.settings.placeholder"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                         disabled>
                </template>
                
                <template x-if="question.settings.textType === 'multiple_lines'">
                  <textarea :placeholder="question.settings.placeholder" 
                            class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                            rows="3" 
                            disabled></textarea>
                </template>
                
                <template x-if="question.settings.textType === 'essay_box'">
                  <textarea :placeholder="question.settings.placeholder" 
                            class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                            rows="6" 
                            disabled></textarea>
                </template>
                
                <template x-if="question.settings.textType === 'password'">
                  <input type="password" 
                         placeholder="••••••••"
                         class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                         disabled>
                </template>
                
                <template x-if="question.settings.textType === 'autocomplete'">
                  <div class="relative">
                    <input type="text" 
                           :placeholder="question.settings.placeholder"
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                           disabled>
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </template>
                
                <div x-show="question.settings.characterCount" class="mt-2 text-sm text-gray-500 text-right">
                  <span>0</span> / <span x-text="question.settings.maxLength"></span> characters
                </div>
              </div>
            </template>
            
            <!-- Long Text -->
            <template x-if="question.type === 'long_text'">
              <div>
                <textarea :placeholder="question.settings.placeholder" 
                          class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                          :rows="question.settings.rows" 
                          :class="{'resize-y': question.settings.resizable}"
                          disabled></textarea>
                <div class="mt-2 flex justify-between text-sm text-gray-500">
                  <div x-show="question.settings.richText" class="flex gap-2">
                    <button class="p-1 hover:bg-gray-100 rounded" disabled><b>B</b></button>
                    <button class="p-1 hover:bg-gray-100 rounded" disabled><i>I</i></button>
                    <button class="p-1 hover:bg-gray-100 rounded" disabled><u>U</u></button>
                  </div>
                  <div>
                    <span x-show="question.settings.characterCount">
                      <span>0</span> / <span x-text="question.settings.maxLength"></span> characters
                    </span>
                    <span x-show="question.settings.wordCount" class="ml-3">
                      <span>0</span> words
                    </span>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- Checkbox List -->
            <template x-if="question.type === 'checkbox'">
              <div class="space-y-2"
                   :class="{
                     'grid grid-cols-2 gap-3': question.settings.layout === 'grid' && question.settings.columns === 2,
                     'grid grid-cols-3 gap-3': question.settings.layout === 'grid' && question.settings.columns === 3,
                     'grid grid-cols-4 gap-3': question.settings.layout === 'grid' && question.settings.columns === 4
                   }">
                <div x-show="question.settings.selectAllOption" class="question-option border-b border-gray-200 pb-2 mb-2">
                  <div class="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0"></div>
                  <span class="text-gray-700 font-medium">Select All</span>
                </div>
                
                <template x-for="(option, optionIndex) in question.options" :key="option.id">
                    <div class="question-option"
                         :data-option-id="option.id">
                        <div class="option-drag-handle">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                            </svg>
                        </div>
                        <div class="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0"
                             :class="{'border-red-500': question.settings.exclusiveOptions.includes(option.id)}"></div>
                        <input type="text" 
                               x-model="option.text"
                               @click.stop
                               @input="$store.ui.debouncedAutosave()"
                               @keydown.enter="addOption(question.id)"
                               @keydown.backspace="option.text === '' && removeOption(question.id, option.id)"
                               :data-option-id="option.id"
                               class="flex-1 px-3 py-1.5 bg-white border-0 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200"
                               placeholder="Option text...">
                        <button @click.stop="removeOption(question.id, option.id)"
                                x-show="question.options.length > 2"
                                class="option-remove">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </template>
                <button @click.stop="addOption(question.id)"
                        class="add-option-button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Add option</span>
                </button>
              </div>
            </template>
            
            <!-- Dropdown -->
            <template x-if="question.type === 'dropdown'">
              <div>
                <select class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" 
                        :multiple="question.settings.multiSelect"
                        disabled>
                    <option x-text="question.settings.placeholder"></option>
                    <template x-for="option in question.options" :key="option.id">
                        <option x-text="option.text"></option>
                    </template>
                </select>
                <div x-show="question.settings.searchable" class="text-xs text-gray-500 mt-1">
                  <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Searchable dropdown
                </div>
              </div>
            </template>
            
            <!-- Yes/No -->
            <template x-if="question.type === 'yes_no'">
              <div>
                <!-- Buttons Format -->
                <template x-if="question.settings.displayFormat === 'buttons'">
                  <div class="flex gap-3">
                    <button class="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1">
                        <span x-show="question.settings.includeIcons" x-text="question.settings.customIcons.yes" class="text-2xl block mb-1"></span>
                        <span class="text-sm font-medium" x-text="question.settings.labels.yes"></span>
                    </button>
                    <button class="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1">
                        <span x-show="question.settings.includeIcons" x-text="question.settings.customIcons.no" class="text-2xl block mb-1"></span>
                        <span class="text-sm font-medium" x-text="question.settings.labels.no"></span>
                    </button>
                    <button x-show="question.settings.labels.maybe" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1">
                        <span class="text-sm font-medium" x-text="question.settings.labels.maybe"></span>
                    </button>
                  </div>
                </template>
                
                <!-- Toggle Format -->
                <template x-if="question.settings.displayFormat === 'toggle'">
                  <div class="flex items-center justify-center">
                    <span class="mr-3 text-gray-700" x-text="question.settings.labels.no"></span>
                    <label class="toggle-switch">
                      <input type="checkbox" disabled>
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="ml-3 text-gray-700" x-text="question.settings.labels.yes"></span>
                  </div>
                </template>
                
                <!-- Radio Format -->
                <template x-if="question.settings.displayFormat === 'radio'">
                  <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                      <input type="radio" name="yesno" disabled class="w-4 h-4">
                      <span x-text="question.settings.labels.yes"></span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input type="radio" name="yesno" disabled class="w-4 h-4">
                      <span x-text="question.settings.labels.no"></span>
                    </label>
                    <label x-show="question.settings.labels.maybe" class="flex items-center space-x-2">
                      <input type="radio" name="yesno" disabled class="w-4 h-4">
                      <span x-text="question.settings.labels.maybe"></span>
                    </label>
                  </div>
                </template>
              </div>
            </template>
            
            <!-- Star Rating -->
            <template x-if="question.type === 'star_rating'">
              <div class="flex gap-2">
                <template x-for="i in question.settings.maxStars">
                    <button class="text-3xl transition-colors"
                            :style="{'color': question.settings.color}"
                            :class="i <= 3 ? 'opacity-100' : 'opacity-30'">
                      <span x-text="question.settings.customIcon"></span>
                    </button>
                </template>
                <span x-show="question.settings.showNumericValue" class="ml-2 text-lg font-medium text-gray-600">3.0</span>
              </div>
            </template>
            
            <!-- Number Scale -->
            <template x-if="question.type === 'number_scale'">
              <div>
                <!-- Buttons Display -->
                <template x-if="question.settings.displayAs === 'buttons'">
                  <div class="flex gap-2" :class="{'flex-col': question.settings.layout === 'vertical'}">
                    <template x-for="i in (question.settings.maxValue - question.settings.minValue + 1)">
                        <button class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-sm"
                                :class="{'w-full': question.settings.layout === 'vertical'}"
                                x-text="question.settings.minValue + i - 1"></button>
                    </template>
                  </div>
                </template>
                
                <!-- Slider Display -->
                <template x-if="question.settings.displayAs === 'slider'">
                  <div class="relative pt-6">
                    <input type="range" 
                           class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                           :min="question.settings.minValue" 
                           :max="question.settings.maxValue" 
                           :value="Math.round((question.settings.maxValue + question.settings.minValue) / 2)"
                           disabled>
                    <div class="flex justify-between text-sm text-gray-500 mt-2">
                        <span x-text="question.settings.labels.min || question.settings.minValue"></span>
                        <span x-text="question.settings.labels.max || question.settings.maxValue"></span>
                    </div>
                  </div>
                </template>
                
                <label x-show="question.settings.notApplicable" class="flex items-center space-x-2 mt-3">
                  <input type="checkbox" disabled class="w-4 h-4">
                  <span class="text-sm text-gray-600">Not Applicable</span>
                </label>
              </div>
            </template>
            
            <!-- NPS Score -->
            <template x-if="question.type === 'nps'">
              <div>
                <div class="flex gap-1">
                    <template x-for="i in 11">
                        <button class="w-10 h-10 rounded border border-gray-200 hover:border-indigo-500 transition-colors font-medium text-sm"
                                :class="{
                                    'bg-red-50 text-red-600 border-red-200': i-1 <= 6,
                                    'bg-yellow-50 text-yellow-600 border-yellow-200': i-1 >= 7 && i-1 <= 8,
                                    'bg-green-50 text-green-600 border-green-200': i-1 >= 9
                                }"
                                x-text="i-1"></button>
                    </template>
                </div>
                <div class="flex justify-between mt-2 text-xs text-gray-500">
                    <span x-text="question.settings.labels.min"></span>
                    <span x-text="question.settings.labels.max"></span>
                </div>
                <div x-show="question.settings.showGrouping" class="mt-3 flex justify-between text-xs">
                    <span class="text-red-600">Detractors (0-6)</span>
                    <span class="text-yellow-600">Passives (7-8)</span>
                    <span class="text-green-600">Promoters (9-10)</span>
                </div>
              </div>
            </template>
            
            <!-- Likert Scale -->
            <template x-if="question.type === 'likert'">
              <div class="space-y-2">
                <div class="flex gap-2 justify-between"
                     :class="{'grid grid-cols-' + question.settings.scalePoints: question.settings.scalePoints > 5}">
                    <template x-for="(label, index) in question.settings.labels" :key="index">
                      <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1 text-center"
                              x-text="label"></button>
                    </template>
                </div>
              </div>
            </template>
            
            <!-- Slider -->
            <template x-if="question.type === 'slider'">
              <div>
                <!-- Single Slider -->
                <template x-if="!question.settings.statements || question.settings.statements.length === 0">
                  <!-- Slider Type -->
                  <template x-if="question.settings.type === 'sliders'">
                    <div class="relative pt-6">
                      <input type="range" 
                             class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                             :min="question.settings.min" 
                             :max="question.settings.max" 
                             :step="question.settings.step"
                             :value="(question.settings.max + question.settings.min) / 2"
                             disabled>
                      <div x-show="question.settings.showValue" class="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                        <span x-text="(question.settings.max + question.settings.min) / 2"></span>
                      </div>
                    </div>
                  </template>
                  
                  <!-- Bar Type -->
                  <template x-if="question.settings.type === 'bars'">
                    <div class="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                      <div class="absolute left-0 top-0 h-full bg-indigo-600 transition-all" 
                           style="width: 50%"></div>
                      <div x-show="question.settings.showValue" class="absolute inset-0 flex items-center justify-center text-white font-medium">
                        50
                      </div>
                    </div>
                  </template>
                  
                  <!-- Star Type -->
                  <template x-if="question.settings.type === 'stars'">
                    <div class="flex gap-1">
                      <template x-for="i in 5">
                        <button class="text-3xl transition-colors"
                                :class="i <= 3 ? 'text-yellow-400' : 'text-gray-300'">★</button>
                      </template>
                    </div>
                  </template>
                  
                  <div class="flex justify-between text-sm text-gray-500 mt-2">
                      <span x-text="question.settings.min"></span>
                      <span x-show="question.settings.showLabels" class="text-indigo-600 font-medium">
                        <span x-text="(question.settings.max + question.settings.min) / 2"></span>
                      </span>
                      <span x-text="question.settings.max"></span>
                  </div>
                </template>
                
                <!-- Multiple Sliders -->
                <template x-if="question.settings.statements && question.settings.statements.length > 0">
                  <div class="space-y-4">
                    <template x-for="statement in question.settings.statements" :key="statement.id">
                      <div>
                        <label class="text-sm font-medium text-gray-700 mb-2 block" x-text="statement.text"></label>
                        <input type="range" 
                               class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                               :min="question.settings.min" 
                               :max="question.settings.max" 
                               disabled>
                      </div>
                    </template>
                  </div>
                </template>
                
                <label x-show="question.settings.notApplicable" class="flex items-center space-x-2 mt-3">
                  <input type="checkbox" disabled class="w-4 h-4">
                  <span class="text-sm text-gray-600">Not Applicable</span>
                </label>
              </div>
            </template>
            
            <!-- Emoji Scale -->
            <template x-if="question.type === 'emoji_scale'">
              <div class="flex gap-3 justify-center">
                <template x-for="(emoji, index) in question.settings.emojis" :key="index">
                  <div class="text-center">
                    <button class="text-4xl hover:scale-110 transition-transform"
                            :class="{'animate-bounce': question.settings.animated && index === 2}"
                            x-text="emoji"></button>
                    <div x-show="question.settings.showTooltips" 
                         class="text-xs text-gray-500 mt-1"
                         x-text="question.settings.tooltips[index]"></div>
                  </div>
                </template>
              </div>
            </template>
            
            <!-- Number Input -->
            <template x-if="question.type === 'number'">
              <div class="relative">
                <span x-show="question.settings.format === 'currency' && question.settings.currencyPosition === 'before'" 
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      x-text="question.settings.currencySymbol"></span>
                <input type="number" 
                       placeholder="Enter a number..." 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       :class="{
                         'pl-8': question.settings.format === 'currency' && question.settings.currencyPosition === 'before',
                         'pr-8': question.settings.format === 'currency' && question.settings.currencyPosition === 'after' || question.settings.format === 'percentage'
                       }"
                       :min="question.validation.min"
                       :max="question.validation.max"
                       :step="question.settings.decimals > 0 ? Math.pow(10, -question.settings.decimals) : 1"
                       disabled>
                <span x-show="question.settings.format === 'currency' && question.settings.currencyPosition === 'after'" 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      x-text="question.settings.currencySymbol"></span>
                <span x-show="question.settings.format === 'percentage'" 
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                <div x-show="question.settings.showIncrementButtons" class="absolute right-1 top-1 bottom-1 flex flex-col">
                  <button class="px-2 hover:bg-gray-200 rounded" disabled>▲</button>
                  <button class="px-2 hover:bg-gray-200 rounded" disabled>▼</button>
                </div>
              </div>
            </template>
            
            <!-- Email Input -->
            <template x-if="question.type === 'email'">
              <div>
                <input type="email" 
                       placeholder="email@example.com" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
                <div x-show="question.settings.verifyEmail" class="text-xs text-gray-500 mt-1">
                  Email verification will be required
                </div>
              </div>
            </template>
            
            <!-- Phone Input -->
            <template x-if="question.type === 'phone'">
              <div class="flex gap-2">
                <select x-show="question.settings.countryCode" 
                        class="px-3 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" 
                        disabled>
                  <option>+1</option>
                </select>
                <input type="tel" 
                       placeholder="+1 (555) 000-0000" 
                       class="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
                <input x-show="question.settings.extensionField"
                       type="text" 
                       placeholder="Ext" 
                       class="w-20 px-3 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
              </div>
            </template>
            
            <!-- URL Input -->
            <template x-if="question.type === 'url'">
              <div>
                <input type="url" 
                       placeholder="https://example.com" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
                <div x-show="question.settings.qrCodeGeneration" class="mt-2 p-4 bg-gray-100 rounded-lg text-center">
                  <div class="w-32 h-32 bg-white mx-auto rounded border border-gray-300"></div>
                  <p class="text-xs text-gray-500 mt-2">QR Code will be generated</p>
                </div>
              </div>
            </template>
            
            <!-- Date Input -->
            <template x-if="question.type === 'date'">
              <div>
                <input type="date" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
                <div x-show="question.settings.dateRange" class="flex gap-2 mt-2">
                  <span class="text-sm text-gray-500">to</span>
                  <input type="date" 
                         class="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                         disabled>
                </div>
              </div>
            </template>
            
            <!-- Time Input -->
            <template x-if="question.type === 'time'">
              <div>
                <input type="time" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       :step="question.settings.durationInput ? 1 : 60"
                       disabled>
                <select x-show="question.settings.timeZone" 
                        class="w-full mt-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                        disabled>
                  <option>Select Time Zone</option>
                  <option>EST - Eastern Time</option>
                  <option>CST - Central Time</option>
                  <option>PST - Pacific Time</option>
                </select>
              </div>
            </template>
            
            <!-- Matrix Table -->
            <template x-if="question.type === 'matrix'">
              <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="text-left p-2"></th>
                            <template x-for="point in question.settings.scalePoints || ['Column 1', 'Column 2', 'Column 3']" :key="point">
                              <th class="text-center p-2 text-sm font-normal text-gray-600" x-text="point"></th>
                            </template>
                        </tr>
                    </thead>
                    <tbody>
                        <template x-for="statement in question.settings.statements || [{text: 'Row 1'}, {text: 'Row 2'}]" :key="statement.id || statement.text">
                          <tr class="border-t border-gray-100">
                              <td class="p-2 text-sm" x-text="statement.text"></td>
                              <template x-for="point in question.settings.scalePoints || ['', '', '']" :key="point">
                                <td class="text-center p-2">
                                  <input :type="question.settings.answerType === 'multiple' ? 'checkbox' : 'radio'" 
                                         :name="'matrix_' + statement.id" 
                                         disabled>
                                </td>
                              </template>
                          </tr>
                        </template>
                    </tbody>
                </table>
              </div>
            </template>
            
            <!-- Placeholders for unimplemented advanced types -->
            <template x-if="['ranking', 'constant_sum', 'max_diff', 'side_by_side', 'card_sort', 
                             'file_upload', 'image_choice', 'signature', 'drawing', 
                             'video_response', 'audio_response', 'heat_map', 'hot_spot', 
                             'map_location', 'priority_grid'].includes(question.type)">
              <div class="p-8 bg-gray-50 rounded-lg text-center">
                <div class="text-4xl mb-2">
                  <span x-show="question.type === 'ranking'">📋</span>
                  <span x-show="question.type === 'constant_sum'">💯</span>
                  <span x-show="question.type === 'max_diff'">⚖️</span>
                  <span x-show="question.type === 'side_by_side'">📊</span>
                  <span x-show="question.type === 'card_sort'">🗂️</span>
                  <span x-show="question.type === 'file_upload'">📎</span>
                  <span x-show="question.type === 'image_choice'">🖼️</span>
                  <span x-show="question.type === 'signature'">✍️</span>
                  <span x-show="question.type === 'drawing'">🎨</span>
                  <span x-show="question.type === 'video_response'">📹</span>
                  <span x-show="question.type === 'audio_response'">🎤</span>
                  <span x-show="question.type === 'heat_map'">🔥</span>
                  <span x-show="question.type === 'hot_spot'">🎯</span>
                  <span x-show="question.type === 'map_location'">📍</span>
                  <span x-show="question.type === 'priority_grid'">⊞</span>
                </div>
                <p class="text-gray-500 text-sm">
                  <span x-text="question.type.replace('_', ' ').replace(/\\b\\w/g, l => l.toUpperCase())"></span>
                  question type will be displayed here
                </p>
              </div>
            </template>
            
            <!-- Question Actions -->
            <div class="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <span class="toggle-switch toggle-switch-sm">
                        <input type="checkbox" 
                               x-model="question.required"
                               @change="$store.ui.debouncedAutosave()">
                        <span class="toggle-slider"></span>
                    </span>
                    <span>Required</span>
                </label>
                <button class="hover:text-gray-700 transition-colors">Add Logic</button>
                <button @click.stop="$store.survey.duplicateQuestion(question.id)" class="hover:text-gray-700 transition-colors">Duplicate</button>
                <button @click.stop="$store.ui.openSettingsPanel(question.id)"
                        class="hover:text-gray-700 transition-colors flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                </button>
            </div>
        </div>
        </div>
      </div>
    </template>
    </div>
  `
}