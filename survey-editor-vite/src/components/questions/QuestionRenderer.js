// Question Renderer - Template for rendering questions
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
             // Add dragging state to container and prevent text selection
             evt.from.classList.add('sortable-dragging');
             document.body.style.userSelect = 'none';
             document.body.style.webkitUserSelect = 'none';
           },
           onEnd: function(evt) {
             // Clean up dragging state and restore text selection
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
            <div x-show="question.type === 'multiple_choice'" 
                 class="space-y-2"
                 x-data="{
                   handleOptionSort(item, position) {
                     console.log('Option reordered:', item, 'to position', position);
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
                   animation: 150,
                   ghostClass: 'sortable-ghost',
                   dragClass: 'sortable-drag',
                   chosenClass: 'sortable-chosen',
                   onStart: function(evt) {
                     // Add dragging state to container and prevent text selection
                     evt.from.classList.add('sortable-dragging');
                     document.body.style.userSelect = 'none';
                     document.body.style.webkitUserSelect = 'none';
                   },
                   onEnd: function(evt) {
                     // Clean up dragging state and restore text selection
                     evt.from.classList.remove('sortable-dragging');
                     document.body.style.userSelect = '';
                     document.body.style.webkitUserSelect = '';
                   }
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
                        
                        <div class="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                        
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
                
                <!-- Add Option Button -->
                <button @click.stop="addOption(question.id)"
                        class="add-option-button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Add option</span>
                </button>
            </div>
            
            <!-- Text Input -->
            <div x-show="question.type === 'text_input'">
                <textarea placeholder="Respondent will type their answer here..." 
                          class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                          rows="4" 
                          disabled></textarea>
            </div>
            
            <!-- Long Text -->
            <div x-show="question.type === 'long_text'">
                <textarea placeholder="Respondent will type their detailed answer here..." 
                          class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                          rows="8" 
                          disabled></textarea>
                <div class="mt-2 text-sm text-gray-500 text-right">
                    <span>0</span> / <span x-text="question.settings?.maxLength || 500"></span> characters
                </div>
            </div>
            
            <!-- Checkbox List -->
            <div x-show="question.type === 'checkbox'" 
                 class="space-y-2"
                 x-data="{
                   handleOptionSort(item, position) {
                     console.log('Option reordered:', item, 'to position', position);
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
                   animation: 150,
                   ghostClass: 'sortable-ghost',
                   dragClass: 'sortable-drag',
                   chosenClass: 'sortable-chosen',
                   onStart: function(evt) {
                     // Add dragging state to container and prevent text selection
                     evt.from.classList.add('sortable-dragging');
                     document.body.style.userSelect = 'none';
                     document.body.style.webkitUserSelect = 'none';
                   },
                   onEnd: function(evt) {
                     // Clean up dragging state and restore text selection
                     evt.from.classList.remove('sortable-dragging');
                     document.body.style.userSelect = '';
                     document.body.style.webkitUserSelect = '';
                   }
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
                        <div class="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0"></div>
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
            
            <!-- Yes/No -->
            <div x-show="question.type === 'yes_no'" class="flex gap-3">
                <button class="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1">
                    <svg class="w-5 h-5 mx-auto mb-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm font-medium">Yes</span>
                </button>
                <button class="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex-1">
                    <svg class="w-5 h-5 mx-auto mb-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="text-sm font-medium">No</span>
                </button>
            </div>
            
            <!-- Dropdown -->
            <div x-show="question.type === 'dropdown'">
                <select class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed" disabled>
                    <option>Select an option...</option>
                    <template x-for="option in question.options" :key="option.id">
                        <option x-text="option.text"></option>
                    </template>
                </select>
            </div>
            
            <!-- Star Rating -->
            <div x-show="question.type === 'star_rating'" class="flex gap-2">
                <template x-for="i in 5">
                    <button class="text-3xl text-gray-300 hover:text-yellow-400 transition-colors">★</button>
                </template>
            </div>
            
            <!-- Number Scale -->
            <div x-show="question.type === 'number_scale'" class="flex gap-2">
                <template x-for="i in (question.settings?.maxValue || 10)">
                    <button class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-sm"
                            x-text="i"></button>
                </template>
            </div>
            
            <!-- NPS Score -->
            <div x-show="question.type === 'nps'">
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
                    <span>Not likely</span>
                    <span>Very likely</span>
                </div>
            </div>
            
            <!-- Likert Scale -->
            <div x-show="question.type === 'likert'" class="space-y-2">
                <div class="flex gap-2 justify-between">
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Strongly Disagree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Disagree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Neutral</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Agree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Strongly Agree</button>
                </div>
            </div>
            
            <!-- Slider -->
            <div x-show="question.type === 'slider'" class="relative pt-6">
                <input type="range" 
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                       :min="question.settings?.minValue || 0" 
                       :max="question.settings?.maxValue || 100" 
                       value="50"
                       disabled>
                <div class="flex justify-between text-sm text-gray-500 mt-2">
                    <span x-text="question.settings?.minValue || 0"></span>
                    <span class="text-indigo-600 font-medium">50</span>
                    <span x-text="question.settings?.maxValue || 100"></span>
                </div>
            </div>
            
            <!-- Emoji Scale -->
            <div x-show="question.type === 'emoji_scale'" class="flex gap-3 justify-center text-4xl">
                <button class="hover:scale-110 transition-transform">😢</button>
                <button class="hover:scale-110 transition-transform">😟</button>
                <button class="hover:scale-110 transition-transform">😐</button>
                <button class="hover:scale-110 transition-transform">🙂</button>
                <button class="hover:scale-110 transition-transform">😊</button>
            </div>
            
            <!-- Number Input -->
            <div x-show="question.type === 'number'">
                <input type="number" 
                       placeholder="Enter a number..." 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- Email Input -->
            <div x-show="question.type === 'email'">
                <input type="email" 
                       placeholder="email@example.com" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- Phone Input -->
            <div x-show="question.type === 'phone'">
                <input type="tel" 
                       placeholder="+1 (555) 000-0000" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- URL Input -->
            <div x-show="question.type === 'url'">
                <input type="url" 
                       placeholder="https://example.com" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- Date Input -->
            <div x-show="question.type === 'date'">
                <input type="date" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- Time Input -->
            <div x-show="question.type === 'time'">
                <input type="time" 
                       class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                       disabled>
            </div>
            
            <!-- Matrix Table -->
            <div x-show="question.type === 'matrix'" class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="text-left p-2"></th>
                            <th class="text-center p-2 text-sm font-normal text-gray-600">Column 1</th>
                            <th class="text-center p-2 text-sm font-normal text-gray-600">Column 2</th>
                            <th class="text-center p-2 text-sm font-normal text-gray-600">Column 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t border-gray-100">
                            <td class="p-2 text-sm">Row 1</td>
                            <td class="text-center p-2"><input type="radio" name="row1" disabled></td>
                            <td class="text-center p-2"><input type="radio" name="row1" disabled></td>
                            <td class="text-center p-2"><input type="radio" name="row1" disabled></td>
                        </tr>
                        <tr class="border-t border-gray-100">
                            <td class="p-2 text-sm">Row 2</td>
                            <td class="text-center p-2"><input type="radio" name="row2" disabled></td>
                            <td class="text-center p-2"><input type="radio" name="row2" disabled></td>
                            <td class="text-center p-2"><input type="radio" name="row2" disabled></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
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