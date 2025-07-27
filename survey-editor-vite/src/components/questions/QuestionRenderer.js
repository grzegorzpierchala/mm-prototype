// Enhanced Question Renderer with full functionality for Essential and Rating types

export function QuestionRenderer() {
  return `
    <div class="question-blocks-container space-y-4"
         x-data="{
           showQuestionTypes: null,
           draggedQuestion: null,
           draggedOverQuestion: null,
           dropPosition: 'before', // 'before' or 'after'
           lastDragEnter: null,
           dragEnterTimeout: null,
           
           handleQuestionDragStart(e, questionId) {
             this.draggedQuestion = questionId
             e.dataTransfer.effectAllowed = 'move'
             e.dataTransfer.setData('text/html', e.target.innerHTML)
             e.target.classList.add('opacity-40')
           },
           
           handleQuestionDragEnd(e) {
             e.target.classList.remove('opacity-40')
             const questions = [...$store.survey.questions]
             const draggedIndex = questions.findIndex(q => q.id === this.draggedQuestion)
             const targetIndex = questions.findIndex(q => q.id === this.draggedOverQuestion)
             
             if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
               const draggedItem = questions[draggedIndex]
               questions.splice(draggedIndex, 1)
               
               // Adjust target index based on drop position
               let insertIndex = targetIndex
               if (this.dropPosition === 'after') {
                 insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1
               } else {
                 insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
               }
               
               questions.splice(insertIndex, 0, draggedItem)
               $store.survey.questions = questions
               $store.ui.debouncedAutoSave()
             }
             
             // Clear all drag state
             this.draggedQuestion = null
             this.draggedOverQuestion = null
             this.dropPosition = 'before'
             this.lastDragEnter = null
             if (this.dragEnterTimeout) {
               clearTimeout(this.dragEnterTimeout)
               this.dragEnterTimeout = null
             }
           },
           
           handleQuestionDragOver(e, questionId) {
             if (e.preventDefault) {
               e.preventDefault()
             }
             e.dataTransfer.dropEffect = 'move'
             
             // Only process if we're over a valid drop target
             if (this.draggedQuestion && this.draggedQuestion !== questionId) {
               // Calculate if we're in the top or bottom half
               const rect = e.currentTarget.getBoundingClientRect()
               const y = e.clientY - rect.top
               this.dropPosition = y < rect.height / 2 ? 'before' : 'after'
               
               // Update draggedOver if needed
               if (this.draggedOverQuestion !== questionId) {
                 this.draggedOverQuestion = questionId
               }
             }
             
             return false
           },
           
           handleQuestionDragEnter(e, questionId) {
             // Debounce drag enter to prevent rapid firing
             if (this.draggedQuestion && this.draggedQuestion !== questionId) {
               if (this.dragEnterTimeout) {
                 clearTimeout(this.dragEnterTimeout)
               }
               
               this.lastDragEnter = questionId
               this.dragEnterTimeout = setTimeout(() => {
                 if (this.lastDragEnter === questionId) {
                   this.draggedOverQuestion = questionId
                 }
               }, 50)
             }
           },
           
           handleQuestionDragLeave(e) {
             // Check if we're actually leaving the drop zone
             const relatedTarget = e.relatedTarget
             const currentTarget = e.currentTarget
             
             // Only clear if we're not entering a child element
             if (!currentTarget.contains(relatedTarget)) {
               if (this.dragEnterTimeout) {
                 clearTimeout(this.dragEnterTimeout)
                 this.dragEnterTimeout = null
               }
               this.draggedOverQuestion = null
             }
           },
           
           handleQuestionDrop(e) {
             if (e.stopPropagation) {
               e.stopPropagation()
             }
             return false
           }
         }">
    <template x-for="(question, index) in $store.survey.questions" :key="question.id">
      <div class="question-block-wrapper relative"
           :class="{
             'drop-indicator-before': draggedOverQuestion === question.id && dropPosition === 'before' && draggedQuestion !== question.id,
             'drop-indicator-after': draggedOverQuestion === question.id && dropPosition === 'after' && draggedQuestion !== question.id
           }">
        <div class="block group relative bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all"
             :class="{
               'ring-2 ring-indigo-500 shadow-sm': $store.ui.selectedQuestionId === question.id && $store.ui.settingsPanelOpen,
               'opacity-50': draggedQuestion === question.id
             }"
             :data-question-id="question.id"
             draggable="true"
             @dragstart="handleQuestionDragStart($event, question.id)"
             @dragend="handleQuestionDragEnd($event)"
             @dragover="handleQuestionDragOver($event, question.id)"
             @drop="handleQuestionDrop($event)"
             @dragenter="handleQuestionDragEnter($event, question.id)"
             @dragleave="handleQuestionDragLeave($event)">
        
        <!-- Drag Handle -->
        <div class="drag-handle absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
            <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 4.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3-6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
            </svg>
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
                                <div x-show="$store.ui.recentlyUsedTypes && $store.ui.recentlyUsedTypes.length > 0" class="question-type-section">
                                    <h4 class="question-type-section-title">Recently Used</h4>
                                    <template x-for="typeId in ($store.ui.recentlyUsedTypes || [])" :key="typeId">
                                        <button @click="$dispatch('change-question-type', {questionId: question.id, newType: typeId}); showQuestionTypes = null"
                                                class="question-type-option"
                                                x-show="['text_input', 'long_text', 'multiple_choice', 'checkbox', 'dropdown', 'yes_no', 'star_rating', 'number_scale', 'nps', 'likert', 'slider', 'emoji_scale', 'number', 'email', 'phone', 'url', 'date', 'time', 'matrix', 'ranking', 'constant_sum', 'max_diff', 'side_by_side', 'card_sort', 'file_upload', 'image_choice', 'signature', 'drawing', 'video_response', 'audio_response', 'heat_map', 'hot_spot', 'map_location', 'priority_grid'].includes(typeId)">
                                            <span x-text="{
                                              text_input: '💬',
                                              long_text: '📝',
                                              multiple_choice: '🔘',
                                              checkbox: '☑️',
                                              dropdown: '▼',
                                              yes_no: '👍',
                                              star_rating: '⭐',
                                              number_scale: '🔢',
                                              nps: '🎯',
                                              likert: '📊',
                                              slider: '🎚️',
                                              emoji_scale: '😊',
                                              number: '💯',
                                              email: '✉️',
                                              phone: '📱',
                                              url: '🌐',
                                              date: '📅',
                                              time: '🕐',
                                              matrix: '⊞',
                                              ranking: '📋',
                                              constant_sum: '💯',
                                              max_diff: '⚖️',
                                              side_by_side: '📊',
                                              card_sort: '🗂️',
                                              file_upload: '📎',
                                              image_choice: '🖼️',
                                              signature: '✍️',
                                              drawing: '🎨',
                                              video_response: '📹',
                                              audio_response: '🎤',
                                              heat_map: '🔥',
                                              hot_spot: '🎯',
                                              map_location: '📍',
                                              priority_grid: '⊞'
                                            }[typeId]"></span>
                                            <span x-text="{
                                              text_input: 'Short Text',
                                              long_text: 'Long Text',
                                              multiple_choice: 'Multiple Choice',
                                              checkbox: 'Checkboxes',
                                              dropdown: 'Dropdown',
                                              yes_no: 'Yes/No',
                                              star_rating: 'Star Rating',
                                              number_scale: 'Number Scale',
                                              nps: 'NPS Score',
                                              likert: 'Likert Scale',
                                              slider: 'Slider',
                                              emoji_scale: 'Emoji Scale',
                                              number: 'Number',
                                              email: 'Email',
                                              phone: 'Phone',
                                              url: 'Website',
                                              date: 'Date',
                                              time: 'Time',
                                              matrix: 'Matrix Table',
                                              ranking: 'Rank Order',
                                              constant_sum: 'Constant Sum',
                                              max_diff: 'MaxDiff',
                                              side_by_side: 'Side by Side',
                                              card_sort: 'Card Sort',
                                              file_upload: 'File Upload',
                                              image_choice: 'Image Choice',
                                              signature: 'Signature',
                                              drawing: 'Drawing',
                                              video_response: 'Video',
                                              audio_response: 'Audio',
                                              heat_map: 'Heat Map',
                                              hot_spot: 'Hot Spot',
                                              map_location: 'Map Location',
                                              priority_grid: 'Priority Grid'
                                            }[typeId]"></span>
                                        </button>
                                    </template>
                                </div>
                                
                                <!-- Question Type Categories -->
                                <template x-for="(types, category) in {
                                    essentials: [
                                      { id: 'text_input', name: 'Short Text', icon: '💬' },
                                      { id: 'long_text', name: 'Long Text', icon: '📝' },
                                      { id: 'multiple_choice', name: 'Multiple Choice', icon: '🔘' },
                                      { id: 'checkbox', name: 'Checkboxes', icon: '☑️' },
                                      { id: 'dropdown', name: 'Dropdown', icon: '▼' },
                                      { id: 'yes_no', name: 'Yes/No', icon: '👍' }
                                    ],
                                    rating: [
                                      { id: 'star_rating', name: 'Star Rating', icon: '⭐' },
                                      { id: 'number_scale', name: 'Number Scale', icon: '🔢' },
                                      { id: 'nps', name: 'NPS Score', icon: '🎯' },
                                      { id: 'likert', name: 'Likert Scale', icon: '📊' },
                                      { id: 'slider', name: 'Slider', icon: '🎚️' },
                                      { id: 'emoji_scale', name: 'Emoji Scale', icon: '😊' }
                                    ],
                                    input: [
                                      { id: 'number', name: 'Number', icon: '💯' },
                                      { id: 'email', name: 'Email', icon: '✉️' },
                                      { id: 'phone', name: 'Phone', icon: '📱' },
                                      { id: 'url', name: 'Website', icon: '🌐' },
                                      { id: 'date', name: 'Date', icon: '📅' },
                                      { id: 'time', name: 'Time', icon: '🕐' }
                                    ],
                                    advanced: [
                                      { id: 'matrix', name: 'Matrix Table', icon: '⊞' },
                                      { id: 'ranking', name: 'Rank Order', icon: '📋' },
                                      { id: 'constant_sum', name: 'Constant Sum', icon: '💯' },
                                      { id: 'max_diff', name: 'MaxDiff', icon: '⚖️' },
                                      { id: 'side_by_side', name: 'Side by Side', icon: '📊' },
                                      { id: 'card_sort', name: 'Card Sort', icon: '🗂️' }
                                    ],
                                    media: [
                                      { id: 'file_upload', name: 'File Upload', icon: '📎' },
                                      { id: 'image_choice', name: 'Image Choice', icon: '🖼️' },
                                      { id: 'signature', name: 'Signature', icon: '✍️' },
                                      { id: 'drawing', name: 'Drawing', icon: '🎨' },
                                      { id: 'video_response', name: 'Video', icon: '📹' },
                                      { id: 'audio_response', name: 'Audio', icon: '🎤' }
                                    ],
                                    interactive: [
                                      { id: 'heat_map', name: 'Heat Map', icon: '🔥' },
                                      { id: 'hot_spot', name: 'Hot Spot', icon: '🎯' },
                                      { id: 'map_location', name: 'Map Location', icon: '📍' },
                                      { id: 'priority_grid', name: 'Priority Grid', icon: '⊞' }
                                    ]
                                  }" :key="category">
                                    <div class="question-type-section">
                                        <h4 class="question-type-section-title"
                                            x-text="category.charAt(0).toUpperCase() + category.slice(1)"></h4>
                                        <template x-for="type in types" :key="type.id">
                                            <button @click="$dispatch('change-question-type', {questionId: question.id, newType: type.id}); showQuestionTypes = null"
                                                    class="question-type-option"
                                                    :class="{ 'bg-gray-50': type.id === question.type }">
                                                <span x-text="type.icon"></span>
                                                <span x-text="type.name"></span>
                                            </button>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Question Number -->
                    <div class="relative" @click.stop>
                        <input type="text" 
                               x-model="question.questionNumber" 
                               @input="$dispatch('validate-question-number', {questionId: question.id}); $store.ui.debouncedAutoSave()"
                               @blur="$dispatch('validate-question-number', {questionId: question.id})"
                               class="px-3 py-1 text-sm font-medium rounded-md border transition-all"
                               :class="(!$store.ui.questionNumberValidation[question.id] || $store.ui.questionNumberValidation[question.id].isValid) ? 
                                       'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' : 
                                       'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'"
                               placeholder="Q1">
                        <div x-show="$store.ui.questionNumberValidation[question.id] && !$store.ui.questionNumberValidation[question.id].isValid" 
                             x-transition
                             class="absolute top-full mt-1 left-0 text-xs text-red-600 whitespace-nowrap">
                            Duplicate question number
                        </div>
                    </div>
            </div>
            
            <!-- Question Text -->
            <div class="mb-4" @click.stop>
                <textarea x-model="question.text" 
                          @input="$store.ui.debouncedAutoSave()"
                          rows="2"
                          class="w-full px-0 py-0 border-0 resize-none focus:outline-none focus:ring-0 text-lg font-medium text-gray-800 placeholder-gray-400"
                          placeholder="Type your question here..."
                          style="background: transparent;"></textarea>
            </div>
            
            <!-- Question-specific content based on type -->
            <div @click.stop>
            
            <!-- Essential Question Types -->
            
            <!-- Text Input -->
            <template x-if="question.type === 'text_input'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                showAutocomplete: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                },
                
                get characterCount() {
                  return (this.response || '').length
                },
                
                get filteredAutocomplete() {
                  if (!this.response || !question.settings.autocompleteList?.length) return []
                  return question.settings.autocompleteList
                    .filter(item => item.toLowerCase().includes(this.response.toLowerCase()))
                    .slice(0, 5)
                }
              }">
                <div class="relative">
                  <!-- Single Line -->
                  <template x-if="question.settings.textType === 'single_line'">
                    <input type="text" 
                           :placeholder="question.settings.placeholder"
                           x-model="response"
                           @input="updateResponse($event.target.value)"
                           @focus="focused = true"
                           @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                           :maxlength="question.settings.maxLength"
                           class="w-full px-4 py-3 border rounded-lg transition-all"
                           :class="{
                             'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                             'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                           }">
                  </template>
                  
                  <!-- Multiple Lines -->
                  <template x-if="question.settings.textType === 'multiple_lines'">
                    <textarea :placeholder="question.settings.placeholder"
                              x-model="response"
                              @input="updateResponse($event.target.value)"
                              @focus="focused = true"
                              @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                              :maxlength="question.settings.maxLength"
                              rows="3"
                              class="w-full px-4 py-3 border rounded-lg transition-all resize-none"
                              :class="{
                                'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                                'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                              }"></textarea>
                  </template>
                  
                  <!-- Essay Box -->
                  <template x-if="question.settings.textType === 'essay_box'">
                    <textarea :placeholder="question.settings.placeholder"
                              x-model="response"
                              @input="updateResponse($event.target.value)"
                              @focus="focused = true"
                              @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                              :maxlength="question.settings.maxLength"
                              rows="6"
                              class="w-full px-4 py-3 border rounded-lg transition-all resize-y"
                              :class="{
                                'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                                'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                              }"></textarea>
                  </template>
                  
                  <!-- Password -->
                  <template x-if="question.settings.textType === 'password'">
                    <input type="password" 
                           placeholder="••••••••"
                           x-model="response"
                           @input="updateResponse($event.target.value)"
                           @focus="focused = true"
                           @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                           :maxlength="question.settings.maxLength"
                           class="w-full px-4 py-3 border rounded-lg transition-all"
                           :class="{
                             'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                             'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                           }">
                  </template>
                  
                  <!-- Autocomplete -->
                  <template x-if="question.settings.textType === 'autocomplete'">
                    <div>
                      <input type="text" 
                             :placeholder="question.settings.placeholder"
                             x-model="response"
                             @input="updateResponse($event.target.value); showAutocomplete = true"
                             @focus="focused = true; showAutocomplete = true"
                             @blur="setTimeout(() => { focused = false; showAutocomplete = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id) }, 200)"
                             @keydown.escape="showAutocomplete = false"
                             @keydown.enter.prevent="filteredAutocomplete.length > 0 && updateResponse(filteredAutocomplete[0]); showAutocomplete = false"
                             :maxlength="question.settings.maxLength"
                             class="w-full px-4 py-3 border rounded-lg transition-all"
                             :class="{
                               'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                               'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                             }">
                      
                      <!-- Autocomplete Dropdown -->
                      <div x-show="showAutocomplete && filteredAutocomplete.length > 0"
                           x-transition:enter="transition ease-out duration-150"
                           x-transition:enter-start="opacity-0 transform -translate-y-1"
                           x-transition:enter-end="opacity-100 transform translate-y-0"
                           class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                        <template x-for="item in filteredAutocomplete" :key="item">
                          <button @click="updateResponse(item); showAutocomplete = false"
                                  class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                  x-text="item"></button>
                        </template>
                      </div>
                    </div>
                  </template>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Character Count -->
                <div x-show="question.settings.characterCount" class="mt-2 text-sm text-gray-500 flex justify-between">
                  <div x-show="question.settings.conversationalFeedback && response" class="text-green-600">
                    Thank you for your response!
                  </div>
                  <div class="ml-auto">
                    <span x-text="characterCount"
                          :class="characterCount > question.settings.maxLength * 0.9 ? 'text-orange-600' : ''"></span> 
                    / <span x-text="question.settings.maxLength"></span> characters
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Long Text -->
            <template x-if="question.type === 'long_text'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                },
                
                get characterCount() {
                  return (this.response || '').length
                },
                
                get wordCount() {
                  return this.response ? this.response.trim().split(/\\s+/).filter(word => word.length > 0).length : 0
                },
                
                applyFormat(format) {
                  if (!question.settings.richText) return
                  // Placeholder for rich text formatting
                  console.log('Apply format:', format)
                }
              }">
                <div class="relative">
                  <textarea :placeholder="question.settings.placeholder" 
                            x-model="response"
                            @input="updateResponse($event.target.value)"
                            @focus="focused = true"
                            @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                            :maxlength="question.settings.maxLength"
                            :rows="question.settings.rows" 
                            class="w-full px-4 py-3 border rounded-lg transition-all"
                            :class="{
                              'resize-y': question.settings.resizable,
                              'resize-none': !question.settings.resizable,
                              'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                              'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                            }"></textarea>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-3 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <div class="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <!-- Rich Text Tools -->
                  <div x-show="question.settings.richText" class="flex gap-1">
                    <button @click="applyFormat('bold')" 
                            class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            :class="focused ? 'text-gray-700' : 'text-gray-400'">
                      <b>B</b>
                    </button>
                    <button @click="applyFormat('italic')" 
                            class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            :class="focused ? 'text-gray-700' : 'text-gray-400'">
                      <i>I</i>
                    </button>
                    <button @click="applyFormat('underline')" 
                            class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            :class="focused ? 'text-gray-700' : 'text-gray-400'">
                      <u>U</u>
                    </button>
                    <div class="w-px h-5 bg-gray-300 mx-1"></div>
                    <button @click="applyFormat('list')" 
                            class="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            :class="focused ? 'text-gray-700' : 'text-gray-400'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Counts -->
                  <div class="ml-auto">
                    <span x-show="question.settings.characterCount">
                      <span x-text="characterCount"
                            :class="{
                              'text-orange-600': characterCount > question.settings.maxLength * 0.9,
                              'text-red-600': characterCount >= question.settings.maxLength
                            }"></span> 
                      / <span x-text="question.settings.maxLength"></span> characters
                    </span>
                    <span x-show="question.settings.wordCount" class="ml-3">
                      <span x-text="wordCount"
                            :class="{
                              'text-orange-600': question.validation?.maxWords && wordCount > question.validation.maxWords * 0.9,
                              'text-red-600': question.validation?.maxWords && wordCount >= question.validation.maxWords
                            }"></span> words
                    </span>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Multiple Choice -->
            <template x-if="question.type === 'multiple_choice'">
              <div x-data="{
                response: $store.validation.responses[question.id] || (question.settings.answerType === 'multiple' ? [] : ''),
                draggedItem: null,
                draggedOverItem: null,
                dropPosition: 'before',
                lastOptionDragEnter: null,
                optionDragEnterTimeout: null,
                
                updateResponse(optionId) {
                  if (question.settings.answerType === 'multiple') {
                    if (this.response.includes(optionId)) {
                      this.response = this.response.filter(id => id !== optionId)
                    } else {
                      this.response = [...this.response, optionId]
                    }
                  } else {
                    this.response = optionId
                  }
                  $store.validation.updateResponse(question.id, this.response)
                  $store.validation.mode === 'change' && $store.validation.validateQuestion(question.id)
                },
                
                isSelected(optionId) {
                  if (question.settings.answerType === 'multiple') {
                    return this.response.includes(optionId)
                  }
                  return this.response === optionId
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                },
                
                handleDragStart(e, optionIndex) {
                  this.draggedItem = optionIndex
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/html', e.target.innerHTML)
                  e.target.classList.add('opacity-40')
                },
                
                handleDragEnd(e, questionId) {
                  e.target.classList.remove('opacity-40')
                  const question = $store.survey.questions.find(q => q.id === questionId)
                  if (!question) return
                  
                  const items = [...question.options]
                  if (this.draggedItem !== null && this.draggedOverItem !== null && this.draggedItem !== this.draggedOverItem) {
                    const draggedItemContent = items[this.draggedItem]
                    items.splice(this.draggedItem, 1)
                    
                    let insertIndex = this.draggedOverItem
                    if (this.dropPosition === 'after') {
                      insertIndex = this.draggedItem < this.draggedOverItem ? this.draggedOverItem : this.draggedOverItem + 1
                    } else {
                      insertIndex = this.draggedItem < this.draggedOverItem ? this.draggedOverItem - 1 : this.draggedOverItem
                    }
                    
                    items.splice(insertIndex, 0, draggedItemContent)
                    question.options = items
                    $store.ui.debouncedAutoSave()
                  }
                  
                  // Clear all drag state
                  this.draggedItem = null
                  this.draggedOverItem = null
                  this.dropPosition = 'before'
                  this.lastOptionDragEnter = null
                  if (this.optionDragEnterTimeout) {
                    clearTimeout(this.optionDragEnterTimeout)
                    this.optionDragEnterTimeout = null
                  }
                },
                
                handleDragOver(e, optionIndex) {
                  if (e.preventDefault) {
                    e.preventDefault()
                  }
                  e.dataTransfer.dropEffect = 'move'
                  
                  // Only process if we're over a valid drop target
                  if (this.draggedItem !== null && this.draggedItem !== optionIndex) {
                    // Calculate if we're in the top or bottom half
                    const rect = e.currentTarget.getBoundingClientRect()
                    const y = e.clientY - rect.top
                    this.dropPosition = y < rect.height / 2 ? 'before' : 'after'
                    
                    // Update draggedOver if needed
                    if (this.draggedOverItem !== optionIndex) {
                      this.draggedOverItem = optionIndex
                    }
                  }
                  
                  return false
                },
                
                handleDragEnter(e, optionIndex) {
                  // Debounce drag enter to prevent rapid firing
                  if (this.draggedItem !== null && this.draggedItem !== optionIndex) {
                    if (this.optionDragEnterTimeout) {
                      clearTimeout(this.optionDragEnterTimeout)
                    }
                    
                    this.lastOptionDragEnter = optionIndex
                    this.optionDragEnterTimeout = setTimeout(() => {
                      if (this.lastOptionDragEnter === optionIndex) {
                        this.draggedOverItem = optionIndex
                      }
                    }, 50)
                  }
                },
                
                handleDragLeave(e) {
                  // Check if we're actually leaving the drop zone
                  const relatedTarget = e.relatedTarget
                  const currentTarget = e.currentTarget
                  
                  // Only clear if we're not entering a child element
                  if (!currentTarget.contains(relatedTarget)) {
                    if (this.optionDragEnterTimeout) {
                      clearTimeout(this.optionDragEnterTimeout)
                      this.optionDragEnterTimeout = null
                    }
                    this.draggedOverItem = null
                  }
                },
                
                handleDrop(e) {
                  if (e.stopPropagation) {
                    e.stopPropagation()
                  }
                  return false
                }
              }">
                <!-- List Format -->
                <template x-if="question.settings.displayFormat === 'list' || question.settings.format === 'list'">
                  <div class="space-y-2"
                       :class="{
                         'flex flex-wrap gap-4': question.settings.layout === 'horizontal',
                         'grid grid-cols-2 gap-3': question.settings.layout === 'columns' && question.settings.columns === 2,
                         'grid grid-cols-3 gap-3': question.settings.layout === 'columns' && question.settings.columns === 3,
                         'grid grid-cols-4 gap-3': question.settings.layout === 'columns' && question.settings.columns === 4
                       }">
                    <template x-for="(option, optionIndex) in question.options" :key="option.id">
                      <div class="option-wrapper relative"
                           :class="{
                             'drop-indicator-before': draggedOverItem === optionIndex && dropPosition === 'before' && draggedItem !== optionIndex,
                             'drop-indicator-after': draggedOverItem === optionIndex && dropPosition === 'after' && draggedItem !== optionIndex
                           }">
                        <div class="question-option group relative flex items-center"
                             draggable="true"
                             @dragstart="handleDragStart($event, optionIndex)"
                             @dragend="handleDragEnd($event, question.id)"
                             @dragover="handleDragOver($event, optionIndex)"
                             @drop="handleDrop($event)"
                             @dragenter="handleDragEnter($event, optionIndex)"
                             @dragleave="handleDragLeave($event)"
                             :class="{'opacity-50': draggedItem === optionIndex}">
                        
                        <!-- Drag Handle (subtle dots) -->
                        <div class="drag-handle absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                          <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 4.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm3-6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1z"/>
                          </svg>
                        </div>
                        
                        <label class="flex items-center flex-1 p-3 rounded-lg cursor-pointer transition-all"
                               :class="{
                                 'bg-gray-50': isSelected(option.id),
                                 'hover:bg-gray-50': !isSelected(option.id)
                               }">
                          <input :type="question.settings.answerType === 'multiple' ? 'checkbox' : 'radio'"
                                 :name="'mc_' + question.id"
                                 :checked="isSelected(option.id)"
                                 @change="updateResponse(option.id)"
                                 class="flex-shrink-0"
                                 :class="{
                                   'w-4 h-4 text-indigo-600 focus:ring-indigo-500': question.settings.answerType === 'single',
                                   'w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500': question.settings.answerType === 'multiple'
                                 }">
                          <span class="ml-3 text-gray-700 flex-1" x-text="option.text"></span>
                          
                          <!-- Text Entry Option -->
                          <template x-if="question.settings.allowTextEntry && question.settings.allowTextEntry[option.id]">
                            <input type="text" 
                                   placeholder="Please specify..."
                                   class="ml-3 flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                                   x-show="isSelected(option.id)"
                                   @click.stop>
                          </template>
                        </label>
                        
                        <!-- Remove Option Button (subtle) -->
                        <button @click="$store.survey.removeOption(question.id, option.id)"
                                x-show="question.options.length > 2"
                                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                title="Remove option">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
                
                <!-- Dropdown Format -->
                <template x-if="question.settings.displayFormat === 'dropdown' || question.settings.format === 'dropdown'">
                  <div class="relative">
                    <select x-model="response"
                            @change="$store.validation.updateResponse(question.id, response); $store.validation.validateQuestion(question.id)"
                            class="w-full px-4 py-3 border rounded-lg appearance-none bg-white"
                            :class="{
                              'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                              'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                            }">
                      <option value="">Choose an option...</option>
                      <template x-for="option in question.options" :key="option.id">
                        <option :value="option.id" x-text="option.text"></option>
                      </template>
                    </select>
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </template>
                
                <!-- Select Box Format -->
                <template x-if="question.settings.displayFormat === 'select_box' || question.settings.format === 'select_box'">
                  <div class="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto">
                    <template x-for="option in question.options" :key="option.id">
                      <div class="question-option group relative">
                        <label class="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input :type="question.settings.answerType === 'multiple' ? 'checkbox' : 'radio'"
                                 :name="'mc_' + question.id"
                                 :checked="isSelected(option.id)"
                                 @change="updateResponse(option.id)"
                                 class="flex-shrink-0"
                                 :class="{
                                   'w-4 h-4 text-indigo-600 focus:ring-indigo-500': question.settings.answerType === 'single',
                                   'w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500': question.settings.answerType === 'multiple'
                                 }">
                          <span class="ml-3 text-gray-700 flex-1" x-text="option.text"></span>
                          
                          <!-- Remove Option Button (subtle) -->
                          <button @click="$store.survey.removeOption(question.id, option.id)"
                                  x-show="question.options.length > 2"
                                  class="ml-auto p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                  title="Remove option">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </label>
                      </div>
                    </template>
                  </div>
                </template>
                
                <!-- Add Option Button for editing -->
                <button @click.stop="$store.survey.addOption(question.id)"
                        class="add-option-button mt-3">
                  <span>+</span>
                  <span>Add option</span>
                </button>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Checkbox -->
            <template x-if="question.type === 'checkbox'">
              <div x-data="{
                response: $store.validation.responses[question.id] || [],
                
                updateResponse(optionId) {
                  if (this.response.includes(optionId)) {
                    this.response = this.response.filter(id => id !== optionId)
                  } else {
                    // Check for exclusive options
                    if (question.settings.exclusiveOptions?.includes(optionId)) {
                      this.response = [optionId]
                    } else {
                      // Remove exclusive options when selecting non-exclusive
                      this.response = [...this.response.filter(id => !question.settings.exclusiveOptions?.includes(id)), optionId]
                    }
                  }
                  $store.validation.updateResponse(question.id, this.response)
                  $store.validation.mode === 'change' && $store.validation.validateQuestion(question.id)
                },
                
                toggleSelectAll() {
                  if (this.response.length === question.options.length) {
                    this.response = []
                  } else {
                    this.response = question.options.map(opt => opt.id)
                  }
                  $store.validation.updateResponse(question.id, this.response)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-2"
                     :class="{
                       'grid grid-cols-2 gap-3': question.settings.layout === 'grid' && question.settings.columns === 2,
                       'grid grid-cols-3 gap-3': question.settings.layout === 'grid' && question.settings.columns === 3,
                       'grid grid-cols-4 gap-3': question.settings.layout === 'grid' && question.settings.columns === 4
                     }">
                  <!-- Select All Option -->
                  <label x-show="question.settings.selectAllOption" 
                         class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer transition-all hover:bg-gray-50 font-medium">
                    <input type="checkbox"
                           :checked="response.length === question.options.length"
                           @change="toggleSelectAll()"
                           class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                    <span class="ml-3 text-gray-700">Select All</span>
                  </label>
                  
                  <!-- Regular Options -->
                  <template x-for="option in question.options" :key="option.id">
                    <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                           :class="{
                             'border-blue-500 bg-blue-50': response.includes(option.id),
                             'border-gray-200': !response.includes(option.id),
                             'border-orange-500 bg-orange-50': question.settings.exclusiveOptions?.includes(option.id) && response.includes(option.id)
                           }">
                      <input type="checkbox"
                             :checked="response.includes(option.id)"
                             @change="updateResponse(option.id)"
                             class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                      <span class="ml-3 text-gray-700" x-text="option.text"></span>
                      <span x-show="question.settings.exclusiveOptions?.includes(option.id)" 
                            class="ml-auto text-xs text-orange-600 font-medium">
                        Exclusive
                      </span>
                    </label>
                  </template>
                </div>
                
                <!-- Selection Count -->
                <div x-show="question.settings.minSelections || question.settings.maxSelections" 
                     class="mt-2 text-sm text-gray-500">
                  <span x-text="response.length"></span> selected
                  <span x-show="question.settings.minSelections">
                    (min: <span x-text="question.settings.minSelections"></span>)
                  </span>
                  <span x-show="question.settings.maxSelections">
                    (max: <span x-text="question.settings.maxSelections"></span>)
                  </span>
                </div>
                
                <!-- Add Option Button -->
                <button @click.stop="$store.survey.addOption(question.id)"
                        class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  + Add option
                </button>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Dropdown -->
            <template x-if="question.type === 'dropdown'">
              <div x-data="{
                response: $store.validation.responses[question.id] || (question.settings.multiSelect ? [] : ''),
                showDropdown: false,
                search: '',
                
                get filteredOptions() {
                  if (!this.search || !question.settings.searchable) return question.options
                  return question.options.filter(opt => 
                    opt.text.toLowerCase().includes(this.search.toLowerCase())
                  )
                },
                
                selectOption(optionId) {
                  if (question.settings.multiSelect) {
                    if (this.response.includes(optionId)) {
                      this.response = this.response.filter(id => id !== optionId)
                    } else {
                      this.response = [...this.response, optionId]
                    }
                  } else {
                    this.response = optionId
                    this.showDropdown = false
                  }
                  $store.validation.updateResponse(question.id, this.response)
                  $store.validation.validateQuestion(question.id)
                },
                
                isSelected(optionId) {
                  if (question.settings.multiSelect) {
                    return this.response.includes(optionId)
                  }
                  return this.response === optionId
                },
                
                get displayText() {
                  if (question.settings.multiSelect) {
                    const count = this.response.length
                    if (count === 0) return question.settings.placeholder
                    if (count === 1) {
                      const option = question.options.find(opt => opt.id === this.response[0])
                      return option?.text || ''
                    }
                    return count + ' selected'
                  } else {
                    const option = question.options.find(opt => opt.id === this.response)
                    return option?.text || question.settings.placeholder
                  }
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <!-- Dropdown Trigger -->
                  <button @click="showDropdown = !showDropdown"
                          class="w-full px-4 py-3 border rounded-lg text-left bg-white flex items-center justify-between"
                          :class="{
                            'border-gray-200 hover:border-gray-300': !validation.errors.length,
                            'border-red-300': validation.errors.length > 0
                          }">
                    <span x-text="displayText" 
                          :class="response === '' || response.length === 0 ? 'text-gray-400' : 'text-gray-700'"></span>
                    <svg class="w-5 h-5 text-gray-400 transition-transform"
                         :class="showDropdown ? 'rotate-180' : ''"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div x-show="showDropdown"
                       x-transition:enter="transition ease-out duration-200"
                       x-transition:enter-start="opacity-0 transform -translate-y-2"
                       x-transition:enter-end="opacity-100 transform translate-y-0"
                       @click.away="showDropdown = false"
                       class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    
                    <!-- Search Input -->
                    <div x-show="question.settings.searchable" class="p-2 border-b border-gray-100">
                      <input type="text"
                             x-model="search"
                             placeholder="Search options..."
                             class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                    </div>
                    
                    <!-- Options List -->
                    <div class="max-h-60 overflow-y-auto">
                      <template x-for="option in filteredOptions" :key="option.id">
                        <button @click="selectOption(option.id)"
                                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                :class="isSelected(option.id) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'">
                          <span x-text="option.text"></span>
                          <svg x-show="isSelected(option.id)" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </button>
                      </template>
                      
                      <!-- No Results -->
                      <div x-show="filteredOptions.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                        No options found
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Group Indicator -->
                <div x-show="question.settings.groupOptions" class="mt-1 text-xs text-gray-500">
                  <svg class="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/>
                  </svg>
                  Options are grouped by category
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Yes/No -->
            <template x-if="question.type === 'yes_no'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                
                selectOption(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                  $store.validation.validateQuestion(question.id)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <!-- Buttons Format -->
                <template x-if="question.settings.displayFormat === 'buttons'">
                  <div class="flex gap-3">
                    <button @click="selectOption('yes')"
                            class="flex-1 px-6 py-3 rounded-lg border-2 transition-all"
                            :class="{
                              'border-green-500 bg-green-50 text-green-700': response === 'yes',
                              'border-gray-200 hover:border-gray-300 text-gray-700': response !== 'yes'
                            }">
                      <span x-show="question.settings.includeIcons" 
                            x-text="question.settings.customIcons.yes" 
                            class="text-2xl block mb-1"></span>
                      <span class="font-medium" x-text="question.settings.labels.yes"></span>
                    </button>
                    
                    <button @click="selectOption('no')"
                            class="flex-1 px-6 py-3 rounded-lg border-2 transition-all"
                            :class="{
                              'border-red-500 bg-red-50 text-red-700': response === 'no',
                              'border-gray-200 hover:border-gray-300 text-gray-700': response !== 'no'
                            }">
                      <span x-show="question.settings.includeIcons" 
                            x-text="question.settings.customIcons.no" 
                            class="text-2xl block mb-1"></span>
                      <span class="font-medium" x-text="question.settings.labels.no"></span>
                    </button>
                    
                    <button x-show="question.settings.labels.maybe" 
                            @click="selectOption('maybe')"
                            class="flex-1 px-6 py-3 rounded-lg border-2 transition-all"
                            :class="{
                              'border-amber-500 bg-amber-50 text-amber-700': response === 'maybe',
                              'border-gray-200 hover:border-gray-300 text-gray-700': response !== 'maybe'
                            }">
                      <span class="font-medium" x-text="question.settings.labels.maybe"></span>
                    </button>
                  </div>
                </template>
                
                <!-- Toggle Format -->
                <template x-if="question.settings.displayFormat === 'toggle'">
                  <div class="flex items-center justify-center gap-4">
                    <span class="text-gray-700 font-medium" 
                          :class="response === 'no' ? 'text-red-600' : ''"
                          x-text="question.settings.labels.no"></span>
                    
                    <button @click="selectOption(response === 'yes' ? 'no' : 'yes')"
                            class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
                            :class="response === 'yes' ? 'bg-green-500' : 'bg-gray-300'">
                      <span class="absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
                            :class="response === 'yes' ? 'translate-x-6' : 'translate-x-0'"></span>
                    </button>
                    
                    <span class="text-gray-700 font-medium" 
                          :class="response === 'yes' ? 'text-green-600' : ''"
                          x-text="question.settings.labels.yes"></span>
                  </div>
                </template>
                
                <!-- Radio Format -->
                <template x-if="question.settings.displayFormat === 'radio'">
                  <div class="space-y-3">
                    <label class="flex items-center cursor-pointer group">
                      <input type="radio" 
                             :name="'yn_' + question.id"
                             :checked="response === 'yes'"
                             @change="selectOption('yes')"
                             class="w-4 h-4 text-green-600 focus:ring-green-500">
                      <span class="ml-3 text-gray-700 group-hover:text-gray-900" 
                            x-text="question.settings.labels.yes"></span>
                    </label>
                    
                    <label class="flex items-center cursor-pointer group">
                      <input type="radio" 
                             :name="'yn_' + question.id"
                             :checked="response === 'no'"
                             @change="selectOption('no')"
                             class="w-4 h-4 text-red-600 focus:ring-red-500">
                      <span class="ml-3 text-gray-700 group-hover:text-gray-900" 
                            x-text="question.settings.labels.no"></span>
                    </label>
                    
                    <label x-show="question.settings.labels.maybe" 
                           class="flex items-center cursor-pointer group">
                      <input type="radio" 
                             :name="'yn_' + question.id"
                             :checked="response === 'maybe'"
                             @change="selectOption('maybe')"
                             class="w-4 h-4 text-amber-600 focus:ring-amber-500">
                      <span class="ml-3 text-gray-700 group-hover:text-gray-900" 
                            x-text="question.settings.labels.maybe"></span>
                    </label>
                  </div>
                </template>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Rating Question Types -->
            
            <!-- Star Rating -->
            <template x-if="question.type === 'star_rating'">
              <div x-data="{
                response: $store.validation.responses[question.id] || 0,
                hoveredStar: 0,
                
                selectRating(rating) {
                  this.response = rating
                  $store.validation.updateResponse(question.id, rating)
                  $store.validation.validateQuestion(question.id)
                },
                
                getRating(star) {
                  if (question.settings.interaction === 'half_step') {
                    return star - 0.5
                  }
                  return star
                },
                
                isActive(star) {
                  const current = this.hoveredStar || this.response
                  if (question.settings.interaction === 'continuous') {
                    return star <= current
                  }
                  return star <= Math.ceil(current)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="flex items-center gap-1">
                  <template x-for="star in question.settings.maxStars" :key="star">
                    <button @click="selectRating(star)"
                            @mouseenter="hoveredStar = star"
                            @mouseleave="hoveredStar = 0"
                            class="text-3xl transition-all transform hover:scale-110"
                            :style="{ color: isActive(star) ? question.settings.color : '#E5E7EB' }">
                      <span x-text="question.settings.customIcon"></span>
                    </button>
                  </template>
                  
                  <span x-show="question.settings.showNumericValue && response > 0" 
                        class="ml-3 text-lg font-medium text-gray-700">
                    <span x-text="response.toFixed(1)"></span>
                  </span>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Number Scale -->
            <template x-if="question.type === 'number_scale'">
              <div x-data="{
                response: $store.validation.responses[question.id] || null,
                
                selectNumber(num) {
                  this.response = num
                  $store.validation.updateResponse(question.id, num)
                  $store.validation.validateQuestion(question.id)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <!-- Labels -->
                <div x-show="question.settings.labels.min || question.settings.labels.max" 
                     class="flex justify-between text-sm text-gray-600 mb-2">
                  <span x-text="question.settings.labels.min"></span>
                  <span x-text="question.settings.labels.max"></span>
                </div>
                
                <!-- Buttons Display -->
                <template x-if="question.settings.displayAs === 'buttons'">
                  <div class="flex gap-2"
                       :class="question.settings.layout === 'vertical' ? 'flex-col' : 'flex-wrap'">
                    <template x-for="i in (question.settings.maxValue - question.settings.minValue + 1)" :key="i">
                      <button @click="selectNumber(question.settings.minValue + i - 1)"
                              class="min-w-[40px] h-10 px-3 rounded-lg border-2 font-medium transition-all"
                              :class="{
                                'border-blue-500 bg-blue-50 text-blue-700': response === (question.settings.minValue + i - 1),
                                'border-gray-200 hover:border-gray-300 text-gray-700': response !== (question.settings.minValue + i - 1),
                                'w-full': question.settings.layout === 'vertical'
                              }"
                              x-text="question.settings.minValue + i - 1"></button>
                    </template>
                    
                    <button x-show="question.settings.notApplicable"
                            @click="selectNumber('N/A')"
                            class="min-w-[40px] h-10 px-3 rounded-lg border-2 font-medium transition-all"
                            :class="{
                              'border-gray-500 bg-gray-100 text-gray-700': response === 'N/A',
                              'border-gray-200 hover:border-gray-300 text-gray-700': response !== 'N/A',
                              'w-full': question.settings.layout === 'vertical'
                            }">
                      N/A
                    </button>
                  </div>
                </template>
                
                <!-- Slider Display -->
                <template x-if="question.settings.displayAs === 'slider'">
                  <div class="px-2">
                    <input type="range"
                           :min="question.settings.minValue"
                           :max="question.settings.maxValue"
                           x-model="response"
                           @input="$store.validation.updateResponse(question.id, parseInt(response))"
                           @change="$store.validation.validateQuestion(question.id)"
                           class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                    <div class="flex justify-between mt-2">
                      <template x-for="i in 5" :key="i">
                        <span class="text-xs text-gray-500" 
                              x-text="question.settings.minValue + Math.round((question.settings.maxValue - question.settings.minValue) * (i - 1) / 4)"></span>
                      </template>
                    </div>
                  </div>
                </template>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- NPS -->
            <template x-if="question.type === 'nps'">
              <div x-data="{
                response: $store.validation.responses[question.id] || null,
                
                selectScore(score) {
                  this.response = score
                  $store.validation.updateResponse(question.id, score)
                  $store.validation.validateQuestion(question.id)
                },
                
                getScoreColor(score) {
                  if (score <= 6) return '#EF4444' // red
                  if (score <= 8) return '#F59E0B' // amber
                  return '#10B981' // green
                },
                
                getGroupLabel(score) {
                  if (score <= 6) return 'Detractor'
                  if (score <= 8) return 'Passive'
                  return 'Promoter'
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div>
                  <!-- Labels -->
                  <div class="flex justify-between text-sm text-gray-600 mb-3">
                    <span x-text="question.settings.labels.min"></span>
                    <span x-text="question.settings.labels.max"></span>
                  </div>
                  
                  <!-- Score Buttons -->
                  <div class="flex gap-1">
                    <template x-for="score in 11" :key="score - 1">
                      <button @click="selectScore(score - 1)"
                              class="flex-1 h-12 rounded font-medium transition-all border-2"
                              :style="{
                                backgroundColor: response === (score - 1) ? getScoreColor(score - 1) + '20' : '',
                                borderColor: response === (score - 1) ? getScoreColor(score - 1) : '#E5E7EB',
                                color: response === (score - 1) ? getScoreColor(score - 1) : '#6B7280'
                              }"
                              x-text="score - 1"></button>
                    </template>
                  </div>
                  
                  <!-- Group Indicator -->
                  <div x-show="question.settings.showGrouping && response !== null" 
                       class="mt-3 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          :style="{
                            backgroundColor: getScoreColor(response) + '20',
                            color: getScoreColor(response)
                          }">
                      <span x-text="getGroupLabel(response)"></span>
                    </span>
                  </div>
                  
                  <!-- Follow-up Question -->
                  <div x-show="question.settings.followUpQuestion && response !== null" 
                       x-transition
                       class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-700 mb-2">
                      <span x-show="response <= 6">What could we improve?</span>
                      <span x-show="response > 6 && response <= 8">What would make you more likely to recommend us?</span>
                      <span x-show="response > 8">What do you like most about us?</span>
                    </p>
                    <textarea class="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                              rows="2"
                              placeholder="Your feedback..."></textarea>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Likert -->
            <template x-if="question.type === 'likert'">
              <div x-data="{
                responses: $store.validation.responses[question.id] || {},
                
                selectOption(statementId, value) {
                  this.responses[statementId] = value
                  $store.validation.updateResponse(question.id, this.responses)
                  $store.validation.validateQuestion(question.id)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                },
                
                get statements() {
                  return question.settings.statements || [{ id: 'default', text: question.text }]
                }
              }">
                <div class="space-y-4">
                  <!-- Scale Labels (Desktop) -->
                  <div class="hidden sm:grid grid-cols-6 gap-2 text-sm text-gray-600">
                    <div></div>
                    <template x-for="(label, index) in question.settings.labels" :key="index">
                      <div class="text-center" x-text="label"></div>
                    </template>
                  </div>
                  
                  <!-- Statements -->
                  <template x-for="statement in statements" :key="statement.id">
                    <div class="border-b border-gray-100 pb-4 last:border-0">
                      <p class="text-gray-700 mb-3" x-text="statement.text"></p>
                      
                      <!-- Desktop Layout -->
                      <div class="hidden sm:grid grid-cols-6 gap-2">
                        <div></div>
                        <template x-for="(label, index) in question.settings.labels" :key="index">
                          <label class="text-center">
                            <input type="radio"
                                   :name="'likert_' + question.id + '_' + statement.id"
                                   :checked="responses[statement.id] === index"
                                   @change="selectOption(statement.id, index)"
                                   class="w-4 h-4 text-blue-600 focus:ring-blue-500">
                          </label>
                        </template>
                      </div>
                      
                      <!-- Mobile Layout -->
                      <div class="sm:hidden space-y-2">
                        <template x-for="(label, index) in question.settings.labels" :key="index">
                          <label class="flex items-center p-2 border rounded-lg cursor-pointer"
                                 :class="responses[statement.id] === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                            <input type="radio"
                                   :name="'likert_' + question.id + '_' + statement.id"
                                   :checked="responses[statement.id] === index"
                                   @change="selectOption(statement.id, index)"
                                   class="w-4 h-4 text-blue-600 focus:ring-blue-500">
                            <span class="ml-3 text-sm" x-text="label"></span>
                          </label>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Slider -->
            <template x-if="question.type === 'slider'">
              <div x-data="{
                responses: $store.validation.responses[question.id] || {},
                
                updateSlider(statementId, value) {
                  this.responses[statementId] = parseInt(value)
                  $store.validation.updateResponse(question.id, this.responses)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                },
                
                get statements() {
                  return question.settings.statements?.length > 0 
                    ? question.settings.statements 
                    : [{ id: 'default', text: '' }]
                },
                
                getSliderBackground(value) {
                  const percent = ((value - question.settings.min) / (question.settings.max - question.settings.min)) * 100
                  return 'linear-gradient(to right, #3B82F6 0%, #3B82F6 ' + percent + '%, #E5E7EB ' + percent + '%, #E5E7EB 100%)'
                }
              }">
                <div class="space-y-6">
                  <template x-for="statement in statements" :key="statement.id">
                    <div>
                      <p x-show="statement.text" class="text-gray-700 mb-3" x-text="statement.text"></p>
                      
                      <!-- Slider Type -->
                      <template x-if="question.settings.type === 'sliders'">
                        <div>
                          <div class="relative px-2">
                            <input type="range"
                                   :min="question.settings.min"
                                   :max="question.settings.max"
                                   :step="question.settings.step"
                                   :value="responses[statement.id] || question.settings.min"
                                   @input="updateSlider(statement.id, $event.target.value)"
                                   @change="$store.validation.validateQuestion(question.id)"
                                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                   :style="{ background: getSliderBackground(responses[statement.id] || question.settings.min) }">
                            
                            <!-- Current Value -->
                            <div x-show="question.settings.showValue" 
                                 class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
                              <span x-text="responses[statement.id] || question.settings.min"></span>
                            </div>
                          </div>
                          
                          <!-- Scale Labels -->
                          <div x-show="question.settings.showLabels" class="flex justify-between mt-2 text-xs text-gray-500">
                            <span x-text="question.settings.min"></span>
                            <template x-if="question.settings.labelCount > 2">
                              <span x-text="Math.round((question.settings.max + question.settings.min) / 2)"></span>
                            </template>
                            <span x-text="question.settings.max"></span>
                          </div>
                        </div>
                      </template>
                      
                      <!-- Bars Type -->
                      <template x-if="question.settings.type === 'bars'">
                        <div class="flex items-end gap-1 h-32">
                          <template x-for="i in Math.ceil((question.settings.max - question.settings.min) / question.settings.increments) + 1" :key="i">
                            <button @click="updateSlider(statement.id, question.settings.min + (i - 1) * question.settings.increments); $store.validation.validateQuestion(question.id)"
                                    class="flex-1 bg-gray-200 hover:bg-gray-300 rounded-t transition-all"
                                    :class="{
                                      'bg-blue-500 hover:bg-blue-600': (responses[statement.id] || question.settings.min) >= question.settings.min + (i - 1) * question.settings.increments
                                    }"
                                    :style="{
                                      height: ((i - 1) / Math.ceil((question.settings.max - question.settings.min) / question.settings.increments)) * 100 + '%'
                                    }"></button>
                          </template>
                        </div>
                      </template>
                      
                      <!-- Stars Type -->
                      <template x-if="question.settings.type === 'stars'">
                        <div class="flex gap-2">
                          <template x-for="i in question.settings.max" :key="i">
                            <button @click="updateSlider(statement.id, i); $store.validation.validateQuestion(question.id)"
                                    class="text-2xl transition-all transform hover:scale-110"
                                    :class="{
                                      'text-yellow-400': (responses[statement.id] || 0) >= i,
                                      'text-gray-300': (responses[statement.id] || 0) < i
                                    }">
                              ⭐
                            </button>
                          </template>
                          <span x-show="question.settings.showValue" 
                                class="ml-2 text-gray-700">
                            <span x-text="responses[statement.id] || 0"></span>/<span x-text="question.settings.max"></span>
                          </span>
                        </div>
                      </template>
                      
                      <!-- N/A Option -->
                      <label x-show="question.settings.notApplicable" class="mt-2 flex items-center text-sm">
                        <input type="checkbox"
                               @change="responses[statement.id] = $event.target.checked ? 'N/A' : question.settings.min; $store.validation.updateResponse(question.id, responses)"
                               class="w-4 h-4 text-gray-600 rounded">
                        <span class="ml-2 text-gray-600">Not Applicable</span>
                      </label>
                    </div>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Emoji Scale -->
            <template x-if="question.type === 'emoji_scale'">
              <div x-data="{
                response: $store.validation.responses[question.id] || null,
                hoveredEmoji: null,
                
                selectEmoji(index) {
                  this.response = index
                  $store.validation.updateResponse(question.id, index)
                  $store.validation.validateQuestion(question.id)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="flex items-center justify-center gap-4">
                  <template x-for="(emoji, index) in question.settings.emojis" :key="index">
                    <div class="relative">
                      <button @click="selectEmoji(index)"
                              @mouseenter="hoveredEmoji = index"
                              @mouseleave="hoveredEmoji = null"
                              class="text-5xl transition-all transform"
                              :class="{
                                'scale-125 animate-bounce': response === index,
                                'scale-110': hoveredEmoji === index && response !== index,
                                'opacity-50': response !== null && response !== index,
                                'animate-pulse': question.settings.animated && hoveredEmoji === index
                              }"
                              x-text="emoji"></button>
                      
                      <!-- Tooltip -->
                      <div x-show="question.settings.showTooltips && hoveredEmoji === index"
                           x-transition:enter="transition ease-out duration-200"
                           x-transition:enter-start="opacity-0 transform translate-y-1"
                           x-transition:enter-end="opacity-100 transform translate-y-0"
                           class="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                        <span x-text="question.settings.tooltips[index]"></span>
                      </div>
                    </div>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0 transform -translate-y-1"
                     x-transition:enter-end="opacity-100 transform translate-y-0"
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Matrix -->
            <template x-if="question.type === 'matrix'">
              <div x-data="{
                responses: $store.validation.responses[question.id] || {},
                
                updateResponse(rowId, columnId) {
                  if (!this.responses[rowId]) this.responses[rowId] = {}
                  
                  if (question.settings.multipleAnswers) {
                    this.responses[rowId][columnId] = !this.responses[rowId][columnId]
                  } else {
                    this.responses[rowId] = { [columnId]: true }
                  }
                  
                  $store.validation.updateResponse(question.id, this.responses)
                },
                
                isSelected(rowId, columnId) {
                  return this.responses[rowId] && this.responses[rowId][columnId]
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse">
                    <thead>
                      <tr>
                        <th class="text-left p-3 font-medium text-gray-700"></th>
                        <template x-for="column in question.settings.columns" :key="column.id">
                          <th class="text-center p-3 font-medium text-gray-700 min-w-[100px]" x-text="column.text"></th>
                        </template>
                      </tr>
                    </thead>
                    <tbody>
                      <template x-for="(row, index) in question.settings.rows" :key="row.id">
                        <tr :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                          <td class="p-3 font-medium text-gray-700" x-text="row.text"></td>
                          <template x-for="column in question.settings.columns" :key="column.id">
                            <td class="text-center p-3">
                              <button @click="updateResponse(row.id, column.id)"
                                      class="w-5 h-5 rounded border-2 transition-all"
                                      :class="isSelected(row.id, column.id) 
                                        ? 'bg-blue-500 border-blue-500' 
                                        : 'bg-white border-gray-300 hover:border-gray-400'">
                                <svg x-show="isSelected(row.id, column.id)" 
                                     class="w-3 h-3 text-white mx-auto" 
                                     fill="currentColor" 
                                     viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                </svg>
                              </button>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Ranking -->
            <template x-if="question.type === 'ranking'">
              <div x-data="{
                items: question.options.map((opt, idx) => ({ ...opt, order: idx })),
                draggedItem: null,
                
                handleDragStart(item) {
                  this.draggedItem = item
                },
                
                handleDragOver(e) {
                  e.preventDefault()
                },
                
                handleDrop(e, targetItem) {
                  e.preventDefault()
                  if (!this.draggedItem || this.draggedItem.id === targetItem.id) return
                  
                  const draggedIdx = this.items.findIndex(item => item.id === this.draggedItem.id)
                  const targetIdx = this.items.findIndex(item => item.id === targetItem.id)
                  
                  const newItems = [...this.items]
                  newItems.splice(draggedIdx, 1)
                  newItems.splice(targetIdx, 0, this.draggedItem)
                  
                  this.items = newItems.map((item, idx) => ({ ...item, order: idx }))
                  this.updateResponse()
                  this.draggedItem = null
                },
                
                updateResponse() {
                  const rankedIds = this.items.map(item => item.id)
                  $store.validation.updateResponse(question.id, rankedIds)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }" 
              x-init="updateResponse()">
                <div class="space-y-2">
                  <template x-for="(item, index) in items" :key="item.id">
                    <div draggable="true"
                         @dragstart="handleDragStart(item)"
                         @dragover="handleDragOver($event)"
                         @drop="handleDrop($event, item)"
                         class="flex items-center p-4 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-sm transition-all"
                         :class="draggedItem && draggedItem.id === item.id ? 'opacity-50' : ''">
                      <span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm mr-3"
                            x-text="index + 1"></span>
                      <span class="flex-grow" x-text="item.text"></span>
                      <svg class="w-5 h-5 text-gray-400 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                    </div>
                  </template>
                </div>
                
                <p class="mt-3 text-sm text-gray-500">Drag items to rank them from most to least important</p>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Sum 100 -->
            <template x-if="question.type === 'sum_100'">
              <div x-data="{
                responses: $store.validation.responses[question.id] || {},
                
                updateValue(optionId, value) {
                  const numValue = parseInt(value) || 0
                  this.responses[optionId] = Math.max(0, Math.min(100, numValue))
                  $store.validation.updateResponse(question.id, this.responses)
                },
                
                get total() {
                  return Object.values(this.responses).reduce((sum, val) => sum + (val || 0), 0)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }" x-init="question.options.forEach(opt => { if (!responses[opt.id]) responses[opt.id] = 0 })">
                <div class="space-y-3">
                  <template x-for="option in question.options" :key="option.id">
                    <div class="flex items-center gap-3">
                      <label class="flex-grow font-medium text-gray-700" x-text="option.text"></label>
                      <div class="flex items-center gap-2">
                        <input type="number"
                               :value="responses[option.id] || 0"
                               @input="updateValue(option.id, $event.target.value)"
                               min="0"
                               max="100"
                               class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <span class="text-gray-500">%</span>
                      </div>
                    </div>
                  </template>
                </div>
                
                <!-- Total Display -->
                <div class="mt-4 p-3 rounded-lg transition-all"
                     :class="total === 100 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'">
                  <div class="flex items-center justify-between">
                    <span class="font-medium"
                          :class="total === 100 ? 'text-green-700' : 'text-orange-700'">
                      Total:
                    </span>
                    <span class="font-bold text-lg"
                          :class="total === 100 ? 'text-green-700' : 'text-orange-700'">
                      <span x-text="total"></span>%
                    </span>
                  </div>
                  <p x-show="total !== 100" class="text-sm mt-1"
                     :class="total > 100 ? 'text-orange-600' : 'text-orange-600'">
                    <span x-text="total > 100 ? 'Please reduce by ' + (total - 100) + '%' : 'Please add ' + (100 - total) + '%'"></span>
                  </p>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Max Diff -->
            <template x-if="question.type === 'max_diff'">
              <div x-data="{
                mostImportant: $store.validation.responses[question.id]?.most || null,
                leastImportant: $store.validation.responses[question.id]?.least || null,
                
                selectMost(optionId) {
                  this.mostImportant = this.mostImportant === optionId ? null : optionId
                  if (this.leastImportant === optionId) this.leastImportant = null
                  this.updateResponse()
                },
                
                selectLeast(optionId) {
                  this.leastImportant = this.leastImportant === optionId ? null : optionId
                  if (this.mostImportant === optionId) this.mostImportant = null
                  this.updateResponse()
                },
                
                updateResponse() {
                  $store.validation.updateResponse(question.id, {
                    most: this.mostImportant,
                    least: this.leastImportant
                  })
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr>
                        <th class="text-center p-3 font-medium text-gray-700">Most Important</th>
                        <th class="p-3"></th>
                        <th class="text-center p-3 font-medium text-gray-700">Least Important</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template x-for="option in question.options" :key="option.id">
                        <tr class="border-t border-gray-100">
                          <td class="text-center p-3">
                            <button @click="selectMost(option.id)"
                                    class="w-6 h-6 rounded-full border-2 transition-all"
                                    :class="mostImportant === option.id 
                                      ? 'bg-green-500 border-green-500' 
                                      : 'bg-white border-gray-300 hover:border-green-400'">
                              <svg x-show="mostImportant === option.id" 
                                   class="w-4 h-4 text-white mx-auto" 
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </button>
                          </td>
                          <td class="p-3 text-center font-medium text-gray-700" x-text="option.text"></td>
                          <td class="text-center p-3">
                            <button @click="selectLeast(option.id)"
                                    class="w-6 h-6 rounded-full border-2 transition-all"
                                    :class="leastImportant === option.id 
                                      ? 'bg-red-500 border-red-500' 
                                      : 'bg-white border-gray-300 hover:border-red-400'">
                              <svg x-show="leastImportant === option.id" 
                                   class="w-4 h-4 text-white mx-auto" 
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Side by Side -->
            <template x-if="question.type === 'side_by_side'">
              <div x-data="{
                responses: $store.validation.responses[question.id] || {},
                
                updateResponse(questionId, value) {
                  this.responses[questionId] = value
                  $store.validation.updateResponse(question.id, this.responses)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="grid md:grid-cols-2 gap-6">
                  <template x-for="subQuestion in question.settings.questions" :key="subQuestion.id">
                    <div class="space-y-2">
                      <label class="block font-medium text-gray-700" x-text="subQuestion.text"></label>
                      
                      <!-- Text Input Type -->
                      <template x-if="subQuestion.type === 'text'">
                        <input type="text"
                               :value="responses[subQuestion.id] || ''"
                               @input="updateResponse(subQuestion.id, $event.target.value)"
                               :placeholder="subQuestion.placeholder"
                               class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                      </template>
                      
                      <!-- Select Type -->
                      <template x-if="subQuestion.type === 'select'">
                        <select :value="responses[subQuestion.id] || ''"
                                @change="updateResponse(subQuestion.id, $event.target.value)"
                                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                          <option value="">Choose...</option>
                          <template x-for="option in subQuestion.options" :key="option">
                            <option :value="option" x-text="option"></option>
                          </template>
                        </select>
                      </template>
                      
                      <!-- Radio Type -->
                      <template x-if="subQuestion.type === 'radio'">
                        <div class="space-y-2">
                          <template x-for="option in subQuestion.options" :key="option">
                            <label class="flex items-center">
                              <input type="radio"
                                     :name="'side_by_side_' + question.id + '_' + subQuestion.id"
                                     :value="option"
                                     :checked="responses[subQuestion.id] === option"
                                     @change="updateResponse(subQuestion.id, option)"
                                     class="w-4 h-4 text-blue-600 focus:ring-blue-500">
                              <span class="ml-2" x-text="option"></span>
                            </label>
                          </template>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Groups -->
            <template x-if="question.type === 'groups'">
              <div x-data="{
                expanded: true,
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <button @click="expanded = !expanded"
                          class="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors">
                    <span class="font-medium text-gray-700" x-text="question.text"></span>
                    <svg class="w-5 h-5 text-gray-500 transition-transform"
                         :class="expanded ? 'rotate-180' : ''"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div x-show="expanded"
                       x-transition:enter="transition ease-out duration-200"
                       x-transition:enter-start="opacity-0 -translate-y-2"
                       x-transition:enter-end="opacity-100 translate-y-0"
                       class="p-4 space-y-4">
                    <p class="text-sm text-gray-600">This group contains the following questions:</p>
                    
                    <!-- Nested Questions Preview -->
                    <div class="space-y-3 pl-4 border-l-2 border-gray-200">
                      <template x-for="(nestedQ, idx) in (question.settings.nestedQuestions || [])" :key="idx">
                        <div class="flex items-center gap-2">
                          <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium"
                                x-text="idx + 1"></span>
                          <span class="text-sm text-gray-700" x-text="nestedQ.text || 'Nested question ' + (idx + 1)"></span>
                        </div>
                      </template>
                    </div>
                    
                    <p x-show="!question.settings.nestedQuestions || question.settings.nestedQuestions.length === 0"
                       class="text-sm text-gray-500 italic">No nested questions configured yet</p>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Numeric -->
            <template x-if="question.type === 'numeric'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="number"
                         :placeholder="question.settings.placeholder"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         :min="question.validation.min"
                         :max="question.validation.max"
                         :step="question.settings.decimalPlaces > 0 ? Math.pow(10, -question.settings.decimalPlaces) : 1"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Unit Display -->
                  <span x-show="question.settings.unit"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        x-text="question.settings.unit"></span>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && !question.settings.unit && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Min/Max Display -->
                <div x-show="question.validation.min !== null || question.validation.max !== null"
                     class="mt-2 text-sm text-gray-500">
                  <span x-show="question.validation.min !== null">Min: <span x-text="question.validation.min"></span></span>
                  <span x-show="question.validation.min !== null && question.validation.max !== null" class="mx-2">•</span>
                  <span x-show="question.validation.max !== null">Max: <span x-text="question.validation.max"></span></span>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Email -->
            <template x-if="question.type === 'email'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="email"
                         placeholder="name@example.com"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Email Icon -->
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  
                  <style>
                    input[type="email"] { padding-left: 2.75rem; }
                  </style>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Phone -->
            <template x-if="question.type === 'phone'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  // Auto-format phone number
                  let cleaned = value.replace(/\D/g, '')
                  let formatted = cleaned
                  
                  if (question.settings.format === 'us' && cleaned.length <= 10) {
                    if (cleaned.length >= 6) {
                      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6)
                    } else if (cleaned.length >= 3) {
                      formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3)
                    }
                  } else if (question.settings.format === 'international') {
                    // Keep international format flexible
                    formatted = value
                  }
                  
                  this.response = formatted
                  $store.validation.updateResponse(question.id, formatted)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="tel"
                         :placeholder="question.settings.format === 'us' ? '123-456-7890' : '+1 234 567 8900'"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Phone Icon -->
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  
                  <style>
                    input[type="tel"] { padding-left: 2.75rem; }
                  </style>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- URL -->
            <template x-if="question.type === 'url'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="url"
                         placeholder="https://example.com"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Link Icon -->
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                  </svg>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  
                  <style>
                    input[type="url"] { padding-left: 2.75rem; }
                  </style>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Date -->
            <template x-if="question.type === 'date'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="date"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         :min="question.validation.minDate"
                         :max="question.validation.maxDate"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Calendar Icon -->
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  
                  <style>
                    input[type="date"] { padding-left: 2.75rem; }
                  </style>
                </div>
                
                <!-- Date Range Display -->
                <div x-show="question.validation.minDate || question.validation.maxDate"
                     class="mt-2 text-sm text-gray-500">
                  <span x-show="question.validation.minDate">From: <span x-text="question.validation.minDate"></span></span>
                  <span x-show="question.validation.minDate && question.validation.maxDate" class="mx-2">•</span>
                  <span x-show="question.validation.maxDate">To: <span x-text="question.validation.maxDate"></span></span>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Time -->
            <template x-if="question.type === 'time'">
              <div x-data="{
                response: $store.validation.responses[question.id] || '',
                focused: false,
                
                updateResponse(value) {
                  this.response = value
                  $store.validation.updateResponse(question.id, value)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="relative">
                  <input type="time"
                         x-model="response"
                         @input="updateResponse($event.target.value)"
                         @focus="focused = true"
                         @blur="focused = false; $store.validation.mode === 'blur' && $store.validation.validateQuestion(question.id)"
                         :step="question.settings.format === '24hour' ? 60 : 1"
                         class="w-full px-4 py-3 border rounded-lg transition-all"
                         :class="{
                           'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20': !validation.errors.length,
                           'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20': validation.errors.length > 0
                         }">
                  
                  <!-- Clock Icon -->
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  
                  <!-- Validation Indicator -->
                  <div x-show="!focused && (validation.errors.length > 0 || (response && validation.isValid))"
                       class="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg x-show="validation.errors.length > 0" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <svg x-show="response && validation.isValid" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  
                  <style>
                    input[type="time"] { padding-left: 2.75rem; }
                  </style>
                </div>
                
                <!-- Format Note -->
                <div class="mt-2 text-sm text-gray-500">
                  <span x-text="question.settings.format === '24hour' ? '24-hour format' : '12-hour format'"></span>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- File Upload -->
            <template x-if="question.type === 'file_upload'">
              <div x-data="{
                files: [],
                isDragging: false,
                
                handleFiles(fileList) {
                  const newFiles = Array.from(fileList).filter(file => {
                    // Check file type
                    if (question.settings.acceptedFormats && question.settings.acceptedFormats.length > 0) {
                      const ext = '.' + file.name.split('.').pop().toLowerCase()
                      if (!question.settings.acceptedFormats.includes(ext)) {
                        alert('File type ' + ext + ' not allowed. Accepted: ' + question.settings.acceptedFormats.join(', '))
                        return false
                      }
                    }
                    // Check file size
                    if (question.settings.maxSize && file.size > question.settings.maxSize * 1024 * 1024) {
                      alert('File ' + file.name + ' exceeds maximum size of ' + question.settings.maxSize + 'MB')
                      return false
                    }
                    return true
                  })
                  
                  if (question.settings.multiple) {
                    this.files = [...this.files, ...newFiles].slice(0, question.settings.maxFiles || 10)
                  } else {
                    this.files = newFiles.slice(0, 1)
                  }
                  
                  this.updateResponse()
                },
                
                removeFile(index) {
                  this.files.splice(index, 1)
                  this.updateResponse()
                },
                
                updateResponse() {
                  const fileData = this.files.map(f => ({ name: f.name, size: f.size, type: f.type }))
                  $store.validation.updateResponse(question.id, fileData)
                },
                
                formatFileSize(bytes) {
                  if (bytes < 1024) return bytes + ' B'
                  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
                  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div @drop.prevent="isDragging = false; handleFiles($event.dataTransfer.files)"
                     @dragover.prevent="isDragging = true"
                     @dragleave.prevent="isDragging = false"
                     class="border-2 border-dashed rounded-lg p-8 text-center transition-all"
                     :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'">
                  
                  <input type="file" 
                         @change="handleFiles($event.target.files)"
                         :multiple="question.settings.multiple"
                         :accept="question.settings.acceptedFormats ? question.settings.acceptedFormats.join(',') : ''"
                         class="hidden" 
                         :id="'file-upload-' + question.id">
                  
                  <label :for="'file-upload-' + question.id" class="cursor-pointer">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p class="text-gray-700 font-medium mb-2">
                      Drag and drop files here or click to browse
                    </p>
                    <p class="text-sm text-gray-500">
                      <span x-show="question.settings.acceptedFormats && question.settings.acceptedFormats.length > 0">
                        Accepted: <span x-text="question.settings.acceptedFormats.join(', ')"></span>
                      </span>
                      <span x-show="question.settings.maxSize">
                        Max size: <span x-text="question.settings.maxSize"></span>MB
                      </span>
                    </p>
                  </label>
                </div>
                
                <!-- File List -->
                <div x-show="files.length > 0" class="mt-4 space-y-2">
                  <template x-for="(file, index) in files" :key="index">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div class="flex items-center gap-3">
                        <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                          <p class="font-medium text-gray-700" x-text="file.name"></p>
                          <p class="text-sm text-gray-500" x-text="formatFileSize(file.size)"></p>
                        </div>
                      </div>
                      <button @click="removeFile(index)"
                              class="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Image Select -->
            <template x-if="question.type === 'image_select'">
              <div x-data="{
                selected: $store.validation.responses[question.id] || (question.settings.multipleSelection ? [] : null),
                
                toggleSelection(optionId) {
                  if (question.settings.multipleSelection) {
                    const index = this.selected.indexOf(optionId)
                    if (index === -1) {
                      this.selected.push(optionId)
                    } else {
                      this.selected.splice(index, 1)
                    }
                  } else {
                    this.selected = this.selected === optionId ? null : optionId
                  }
                  $store.validation.updateResponse(question.id, this.selected)
                },
                
                isSelected(optionId) {
                  if (question.settings.multipleSelection) {
                    return this.selected.includes(optionId)
                  }
                  return this.selected === optionId
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="grid gap-4"
                     :class="{
                       'grid-cols-2 md:grid-cols-3': question.settings.layout === 'grid',
                       'grid-cols-1': question.settings.layout === 'list'
                     }">
                  <template x-for="option in question.options" :key="option.id">
                    <button @click="toggleSelection(option.id)"
                            class="relative overflow-hidden rounded-lg border-2 transition-all"
                            :class="isSelected(option.id) 
                              ? 'border-blue-500 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'">
                      
                      <!-- Image -->
                      <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                        <img :src="option.imageUrl || 'https://via.placeholder.com/400x225?text=Image'" 
                             :alt="option.text"
                             class="w-full h-full object-cover">
                      </div>
                      
                      <!-- Label -->
                      <div class="p-3 bg-white">
                        <p class="font-medium text-gray-700" x-text="option.text"></p>
                      </div>
                      
                      <!-- Selection Indicator -->
                      <div x-show="isSelected(option.id)"
                           class="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    </button>
                  </template>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Signature -->
            <template x-if="question.type === 'signature'">
              <div x-data="{
                canvas: null,
                ctx: null,
                isDrawing: false,
                hasSignature: false,
                
                init() {
                  this.$nextTick(() => {
                    this.canvas = this.$refs.signatureCanvas
                    this.ctx = this.canvas.getContext('2d')
                    this.resizeCanvas()
                    window.addEventListener('resize', () => this.resizeCanvas())
                  })
                },
                
                resizeCanvas() {
                  const rect = this.canvas.getBoundingClientRect()
                  this.canvas.width = rect.width
                  this.canvas.height = rect.height
                  this.ctx.strokeStyle = '#000'
                  this.ctx.lineWidth = 2
                  this.ctx.lineCap = 'round'
                  this.ctx.lineJoin = 'round'
                },
                
                startDrawing(e) {
                  this.isDrawing = true
                  const rect = this.canvas.getBoundingClientRect()
                  const x = (e.clientX || e.touches[0].clientX) - rect.left
                  const y = (e.clientY || e.touches[0].clientY) - rect.top
                  this.ctx.beginPath()
                  this.ctx.moveTo(x, y)
                },
                
                draw(e) {
                  if (!this.isDrawing) return
                  const rect = this.canvas.getBoundingClientRect()
                  const x = (e.clientX || e.touches[0].clientX) - rect.left
                  const y = (e.clientY || e.touches[0].clientY) - rect.top
                  this.ctx.lineTo(x, y)
                  this.ctx.stroke()
                  this.hasSignature = true
                },
                
                stopDrawing() {
                  if (this.isDrawing) {
                    this.isDrawing = false
                    this.updateResponse()
                  }
                },
                
                clearSignature() {
                  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                  this.hasSignature = false
                  $store.validation.updateResponse(question.id, null)
                },
                
                updateResponse() {
                  if (this.hasSignature) {
                    const dataUrl = this.canvas.toDataURL('image/png')
                    $store.validation.updateResponse(question.id, dataUrl)
                  }
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-3">
                  <div class="relative border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                    <canvas x-ref="signatureCanvas"
                            @mousedown="startDrawing($event)"
                            @mousemove="draw($event)"
                            @mouseup="stopDrawing()"
                            @mouseleave="stopDrawing()"
                            @touchstart.prevent="startDrawing($event)"
                            @touchmove.prevent="draw($event)"
                            @touchend.prevent="stopDrawing()"
                            class="w-full h-48 cursor-crosshair touch-none"></canvas>
                    
                    <!-- Signature Line -->
                    <div class="absolute bottom-8 left-8 right-8 border-b-2 border-gray-300"></div>
                    <p class="absolute bottom-2 left-8 text-sm text-gray-500">Sign above</p>
                  </div>
                  
                  <div class="flex justify-between">
                    <button @click="clearSignature()"
                            :disabled="!hasSignature"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Clear Signature
                    </button>
                    <p x-show="hasSignature" class="text-sm text-green-600 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Signature captured
                    </p>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Drawing -->
            <template x-if="question.type === 'drawing'">
              <div x-data="{
                canvas: null,
                ctx: null,
                isDrawing: false,
                currentColor: '#000000',
                currentSize: 2,
                hasDrawing: false,
                
                init() {
                  this.$nextTick(() => {
                    this.canvas = this.$refs.drawingCanvas
                    this.ctx = this.canvas.getContext('2d')
                    this.resizeCanvas()
                    window.addEventListener('resize', () => this.resizeCanvas())
                  })
                },
                
                resizeCanvas() {
                  const rect = this.canvas.getBoundingClientRect()
                  this.canvas.width = rect.width
                  this.canvas.height = rect.height
                  this.ctx.lineCap = 'round'
                  this.ctx.lineJoin = 'round'
                },
                
                startDrawing(e) {
                  this.isDrawing = true
                  const rect = this.canvas.getBoundingClientRect()
                  const x = (e.clientX || e.touches[0].clientX) - rect.left
                  const y = (e.clientY || e.touches[0].clientY) - rect.top
                  this.ctx.beginPath()
                  this.ctx.moveTo(x, y)
                  this.ctx.strokeStyle = this.currentColor
                  this.ctx.lineWidth = this.currentSize
                },
                
                draw(e) {
                  if (!this.isDrawing) return
                  const rect = this.canvas.getBoundingClientRect()
                  const x = (e.clientX || e.touches[0].clientX) - rect.left
                  const y = (e.clientY || e.touches[0].clientY) - rect.top
                  this.ctx.lineTo(x, y)
                  this.ctx.stroke()
                  this.hasDrawing = true
                },
                
                stopDrawing() {
                  if (this.isDrawing) {
                    this.isDrawing = false
                    this.updateResponse()
                  }
                },
                
                clearDrawing() {
                  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                  this.hasDrawing = false
                  $store.validation.updateResponse(question.id, null)
                },
                
                updateResponse() {
                  if (this.hasDrawing) {
                    const dataUrl = this.canvas.toDataURL('image/png')
                    $store.validation.updateResponse(question.id, dataUrl)
                  }
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-3">
                  <!-- Drawing Tools -->
                  <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <!-- Color Picker -->
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium text-gray-700">Color:</label>
                      <input type="color" x-model="currentColor" class="w-8 h-8 rounded cursor-pointer">
                      <div class="flex gap-1">
                        <template x-for="color in ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00']" :key="color">
                          <button @click="currentColor = color"
                                  class="w-6 h-6 rounded border-2 border-gray-300"
                                  :style="'background-color: ' + color"></button>
                        </template>
                      </div>
                    </div>
                    
                    <!-- Brush Size -->
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium text-gray-700">Size:</label>
                      <input type="range" x-model="currentSize" min="1" max="20" class="w-24">
                      <span class="text-sm text-gray-600" x-text="currentSize + 'px'"></span>
                    </div>
                  </div>
                  
                  <!-- Canvas -->
                  <div class="relative border-2 border-gray-300 rounded-lg bg-white overflow-hidden">
                    <canvas x-ref="drawingCanvas"
                            @mousedown="startDrawing($event)"
                            @mousemove="draw($event)"
                            @mouseup="stopDrawing()"
                            @mouseleave="stopDrawing()"
                            @touchstart.prevent="startDrawing($event)"
                            @touchmove.prevent="draw($event)"
                            @touchend.prevent="stopDrawing()"
                            class="w-full h-64 cursor-crosshair touch-none"></canvas>
                  </div>
                  
                  <div class="flex justify-between">
                    <button @click="clearDrawing()"
                            :disabled="!hasDrawing"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Clear Drawing
                    </button>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Video Record -->
            <template x-if="question.type === 'video_record'">
              <div x-data="{
                isRecording: false,
                hasRecording: false,
                recordedUrl: null,
                timeElapsed: 0,
                timer: null,
                
                startRecording() {
                  // Mock recording functionality
                  this.isRecording = true
                  this.timeElapsed = 0
                  this.timer = setInterval(() => {
                    this.timeElapsed++
                    if (this.timeElapsed >= (question.settings.maxDuration || 60)) {
                      this.stopRecording()
                    }
                  }, 1000)
                },
                
                stopRecording() {
                  this.isRecording = false
                  this.hasRecording = true
                  clearInterval(this.timer)
                  // Mock recorded video
                  this.recordedUrl = 'data:video/mp4;base64,mockvideodata'
                  $store.validation.updateResponse(question.id, this.recordedUrl)
                },
                
                deleteRecording() {
                  this.hasRecording = false
                  this.recordedUrl = null
                  this.timeElapsed = 0
                  $store.validation.updateResponse(question.id, null)
                },
                
                formatTime(seconds) {
                  const mins = Math.floor(seconds / 60)
                  const secs = seconds % 60
                  return mins + ':' + secs.toString().padStart(2, '0')
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-4">
                  <!-- Video Preview Area -->
                  <div class="relative aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden">
                    <div x-show="!hasRecording" class="flex items-center justify-center h-full">
                      <div class="text-center">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-gray-400">Camera preview will appear here</p>
                      </div>
                    </div>
                    
                    <div x-show="hasRecording" class="flex items-center justify-center h-full">
                      <video controls class="w-full h-full object-contain">
                        <source :src="recordedUrl" type="video/mp4">
                      </video>
                    </div>
                    
                    <!-- Recording Indicator -->
                    <div x-show="isRecording" class="absolute top-4 left-4 flex items-center gap-2">
                      <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span class="text-white font-medium" x-text="formatTime(timeElapsed)"></span>
                    </div>
                  </div>
                  
                  <!-- Controls -->
                  <div class="flex justify-center gap-4">
                    <button x-show="!isRecording && !hasRecording"
                            @click="startRecording()"
                            class="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8"/>
                      </svg>
                      Start Recording
                    </button>
                    
                    <button x-show="isRecording"
                            @click="stopRecording()"
                            class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                      <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="6" y="6" width="8" height="8"/>
                      </svg>
                      Stop Recording
                    </button>
                    
                    <button x-show="hasRecording"
                            @click="deleteRecording()"
                            class="px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Re-record
                    </button>
                  </div>
                  
                  <p class="text-sm text-gray-500 text-center">
                    Maximum duration: <span x-text="question.settings.maxDuration || 60"></span> seconds
                  </p>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Audio Record -->
            <template x-if="question.type === 'audio_record'">
              <div x-data="{
                isRecording: false,
                hasRecording: false,
                recordedUrl: null,
                timeElapsed: 0,
                timer: null,
                
                startRecording() {
                  // Mock recording functionality
                  this.isRecording = true
                  this.timeElapsed = 0
                  this.timer = setInterval(() => {
                    this.timeElapsed++
                    if (this.timeElapsed >= (question.settings.maxDuration || 60)) {
                      this.stopRecording()
                    }
                  }, 1000)
                },
                
                stopRecording() {
                  this.isRecording = false
                  this.hasRecording = true
                  clearInterval(this.timer)
                  // Mock recorded audio
                  this.recordedUrl = 'data:audio/mp3;base64,mockaudiodata'
                  $store.validation.updateResponse(question.id, this.recordedUrl)
                },
                
                deleteRecording() {
                  this.hasRecording = false
                  this.recordedUrl = null
                  this.timeElapsed = 0
                  $store.validation.updateResponse(question.id, null)
                },
                
                formatTime(seconds) {
                  const mins = Math.floor(seconds / 60)
                  const secs = seconds % 60
                  return mins + ':' + secs.toString().padStart(2, '0')
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-4">
                  <!-- Audio Visualizer -->
                  <div class="bg-gray-100 rounded-lg p-8">
                    <div x-show="!hasRecording" class="text-center">
                      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                      </svg>
                      
                      <!-- Recording Animation -->
                      <div x-show="isRecording" class="flex justify-center items-center gap-1 mb-4">
                        <template x-for="i in 5" :key="i">
                          <div class="w-1 bg-blue-500 rounded-full animate-pulse"
                               :style="'height: ' + (Math.random() * 32 + 8) + 'px; animation-delay: ' + (i * 0.1) + 's'"></div>
                        </template>
                      </div>
                      
                      <p class="text-gray-600 font-medium" x-show="isRecording">
                        Recording... <span x-text="formatTime(timeElapsed)"></span>
                      </p>
                      <p class="text-gray-500" x-show="!isRecording">Ready to record</p>
                    </div>
                    
                    <div x-show="hasRecording">
                      <audio controls class="w-full">
                        <source :src="recordedUrl" type="audio/mp3">
                      </audio>
                    </div>
                  </div>
                  
                  <!-- Controls -->
                  <div class="flex justify-center gap-4">
                    <button x-show="!isRecording && !hasRecording"
                            @click="startRecording()"
                            class="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                      <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="8"/>
                      </svg>
                      Start Recording
                    </button>
                    
                    <button x-show="isRecording"
                            @click="stopRecording()"
                            class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                      <svg class="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <rect x="6" y="6" width="8" height="8"/>
                      </svg>
                      Stop Recording
                    </button>
                    
                    <button x-show="hasRecording"
                            @click="deleteRecording()"
                            class="px-6 py-3 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Re-record
                    </button>
                  </div>
                  
                  <p class="text-sm text-gray-500 text-center">
                    Maximum duration: <span x-text="question.settings.maxDuration || 60"></span> seconds
                  </p>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Heat Map -->
            <template x-if="question.type === 'heat_map'">
              <div x-data="{
                clicks: $store.validation.responses[question.id] || [],
                
                handleClick(e) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
                  
                  if (question.settings.multipleClicks) {
                    this.clicks.push({ x, y })
                  } else {
                    this.clicks = [{ x, y }]
                  }
                  
                  $store.validation.updateResponse(question.id, this.clicks)
                },
                
                clearClicks() {
                  this.clicks = []
                  $store.validation.updateResponse(question.id, [])
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-3">
                  <div class="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
                       @click="handleClick($event)">
                    <!-- Base Image -->
                    <img :src="question.settings.imageUrl || 'https://via.placeholder.com/800x400?text=Click+on+the+image'" 
                         class="w-full h-auto">
                    
                    <!-- Click Markers -->
                    <template x-for="(click, index) in clicks" :key="index">
                      <div class="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 bg-opacity-50 rounded-full border-2 border-red-600"
                           :style="'left: ' + click.x + '%; top: ' + click.y + '%;'">
                        <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-red-600"
                              x-text="index + 1"></span>
                      </div>
                    </template>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-600">
                      <span x-show="question.settings.multipleClicks">
                        Click multiple areas on the image
                      </span>
                      <span x-show="!question.settings.multipleClicks">
                        Click one area on the image
                      </span>
                      <span x-show="clicks.length > 0" class="ml-2 font-medium">
                        (<span x-text="clicks.length"></span> selected)
                      </span>
                    </p>
                    <button @click="clearClicks()"
                            x-show="clicks.length > 0"
                            class="text-sm text-red-600 hover:text-red-700">
                      Clear all
                    </button>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Hot Spot -->
            <template x-if="question.type === 'hot_spot'">
              <div x-data="{
                selectedSpots: $store.validation.responses[question.id] || [],
                
                toggleSpot(spotId) {
                  const index = this.selectedSpots.indexOf(spotId)
                  if (index === -1) {
                    if (question.settings.multipleSelection) {
                      this.selectedSpots.push(spotId)
                    } else {
                      this.selectedSpots = [spotId]
                    }
                  } else {
                    this.selectedSpots.splice(index, 1)
                  }
                  $store.validation.updateResponse(question.id, this.selectedSpots)
                },
                
                isSelected(spotId) {
                  return this.selectedSpots.includes(spotId)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-3">
                  <div class="relative bg-gray-100 rounded-lg overflow-hidden">
                    <!-- Base Image -->
                    <img :src="question.settings.imageUrl || 'https://via.placeholder.com/800x400?text=Hot+Spot+Image'" 
                         class="w-full h-auto">
                    
                    <!-- Hot Spots -->
                    <template x-for="spot in (question.settings.hotSpots || [])" :key="spot.id">
                      <button @click="toggleSpot(spot.id)"
                              class="absolute transform -translate-x-1/2 -translate-y-1/2"
                              :style="'left: ' + spot.x + '%; top: ' + spot.y + '%;'">
                        <div class="relative">
                          <!-- Spot Circle -->
                          <div class="w-12 h-12 rounded-full border-3 transition-all"
                               :class="isSelected(spot.id) 
                                 ? 'bg-blue-500 bg-opacity-30 border-blue-500' 
                                 : 'bg-white bg-opacity-30 border-white hover:bg-opacity-50'">
                            <span class="absolute inset-0 flex items-center justify-center font-bold text-sm"
                                  :class="isSelected(spot.id) ? 'text-blue-700' : 'text-gray-700'"
                                  x-text="spot.label"></span>
                          </div>
                          
                          <!-- Pulse Animation -->
                          <div x-show="!isSelected(spot.id)"
                               class="absolute inset-0 w-12 h-12 rounded-full border-2 border-white animate-ping"></div>
                        </div>
                        
                        <!-- Tooltip -->
                        <div x-show="spot.tooltip"
                             class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                          <span x-text="spot.tooltip"></span>
                        </div>
                      </button>
                    </template>
                  </div>
                  
                  <p class="text-sm text-gray-600">
                    <span x-show="question.settings.multipleSelection">
                      Select all that apply
                    </span>
                    <span x-show="!question.settings.multipleSelection">
                      Select one option
                    </span>
                  </p>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Map Location -->
            <template x-if="question.type === 'map_location'">
              <div x-data="{
                selectedLocation: $store.validation.responses[question.id] || null,
                
                selectLocation(lat, lng) {
                  this.selectedLocation = { lat, lng }
                  $store.validation.updateResponse(question.id, this.selectedLocation)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-3">
                  <!-- Map Container -->
                  <div class="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <!-- Mock Map -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <p class="text-gray-600 font-medium mb-2">Interactive Map</p>
                        <p class="text-sm text-gray-500">Click on the map to select a location</p>
                      </div>
                    </div>
                    
                    <!-- Mock interaction -->
                    <div @click="selectLocation(40.7128, -74.0060)" 
                         class="absolute inset-0 cursor-pointer"></div>
                    
                    <!-- Selected Location Marker -->
                    <div x-show="selectedLocation" 
                         class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Location Display -->
                  <div x-show="selectedLocation" class="p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm text-gray-600">Selected location:</p>
                    <p class="font-medium">
                      Latitude: <span x-text="selectedLocation?.lat?.toFixed(4)"></span>, 
                      Longitude: <span x-text="selectedLocation?.lng?.toFixed(4)"></span>
                    </p>
                  </div>
                  
                  <!-- Search Box -->
                  <div x-show="question.settings.allowSearch" class="relative">
                    <input type="text" 
                           placeholder="Search for a location..."
                           class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Card Sort -->
            <template x-if="question.type === 'card_sort'">
              <div x-data="{
                categories: question.settings.categories || [],
                cards: question.settings.cards || [],
                sortedCards: $store.validation.responses[question.id] || {},
                draggedCard: null,
                
                init() {
                  // Initialize empty arrays for each category
                  this.categories.forEach(cat => {
                    if (!this.sortedCards[cat.id]) {
                      this.sortedCards[cat.id] = []
                    }
                  })
                },
                
                handleDragStart(card) {
                  this.draggedCard = card
                },
                
                handleDragOver(e) {
                  e.preventDefault()
                },
                
                handleDrop(e, categoryId) {
                  e.preventDefault()
                  if (!this.draggedCard) return
                  
                  // Remove card from all categories
                  Object.keys(this.sortedCards).forEach(catId => {
                    const index = this.sortedCards[catId].indexOf(this.draggedCard.id)
                    if (index > -1) {
                      this.sortedCards[catId].splice(index, 1)
                    }
                  })
                  
                  // Add to new category
                  this.sortedCards[categoryId].push(this.draggedCard.id)
                  this.updateResponse()
                  this.draggedCard = null
                },
                
                isCardInCategory(cardId, categoryId) {
                  return this.sortedCards[categoryId] && this.sortedCards[categoryId].includes(cardId)
                },
                
                getUnassignedCards() {
                  return this.cards.filter(card => {
                    return !Object.values(this.sortedCards).some(catCards => catCards.includes(card.id))
                  })
                },
                
                updateResponse() {
                  $store.validation.updateResponse(question.id, this.sortedCards)
                },
                
                get validation() {
                  return $store.validation.getValidation(question.id)
                }
              }">
                <div class="space-y-4">
                  <!-- Unassigned Cards -->
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h4 class="font-medium text-gray-700 mb-3">Cards to Sort</h4>
                    <div class="flex flex-wrap gap-2">
                      <template x-for="card in getUnassignedCards()" :key="card.id">
                        <div draggable="true"
                             @dragstart="handleDragStart(card)"
                             class="px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-move hover:shadow-md transition-all">
                          <span x-text="card.text"></span>
                        </div>
                      </template>
                      <p x-show="getUnassignedCards().length === 0" class="text-gray-500 italic">
                        All cards have been sorted
                      </p>
                    </div>
                  </div>
                  
                  <!-- Categories -->
                  <div class="grid gap-4" :class="categories.length > 2 ? 'md:grid-cols-2' : ''">
                    <template x-for="category in categories" :key="category.id">
                      <div @drop="handleDrop($event, category.id)"
                           @dragover="handleDragOver($event)"
                           class="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg min-h-[120px]">
                        <h4 class="font-medium text-gray-700 mb-3" x-text="category.name"></h4>
                        <div class="space-y-2">
                          <template x-for="cardId in sortedCards[category.id]" :key="cardId">
                            <div draggable="true"
                                 @dragstart="handleDragStart(cards.find(c => c.id === cardId))"
                                 class="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded cursor-move hover:bg-blue-100">
                              <span x-text="cards.find(c => c.id === cardId)?.text"></span>
                            </div>
                          </template>
                          <p x-show="!sortedCards[category.id] || sortedCards[category.id].length === 0" 
                             class="text-gray-400 text-sm italic">
                            Drop cards here
                          </p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                
                <!-- Validation Errors -->
                <div x-show="validation.errors.length > 0 && $store.validation.showErrors"
                     x-transition
                     class="mt-2 text-sm text-red-600">
                  <p x-text="validation.errors[0]"></p>
                </div>
              </div>
            </template>
            
            <!-- Placeholder for other question types -->
            <template x-if="!['text_input', 'long_text', 'multiple_choice', 'checkbox', 'dropdown', 'yes_no', 'star_rating', 'number_scale', 'nps', 'likert', 'slider', 'emoji_scale', 'matrix', 'ranking', 'sum_100', 'max_diff', 'side_by_side', 'groups', 'numeric', 'email', 'phone', 'url', 'date', 'time', 'file_upload', 'image_select', 'signature', 'drawing', 'video_record', 'audio_record', 'heat_map', 'hot_spot', 'map_location', 'card_sort'].includes(question.type)">
              <div class="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                <p class="text-sm font-medium">
                  <span x-text="question.type.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())"></span> 
                  question type will be implemented in the next phase
                </p>
              </div>
            </template>
            
            </div>
            
            <!-- Question Actions -->
            <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <label class="toggle-switch toggle-switch-sm">
                            <input type="checkbox" 
                                   x-model="question.required"
                                   @change="$store.ui.debouncedAutoSave()">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="text-sm text-gray-600">Required</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-2">
                    <button @click="duplicateQuestion(question.id)"
                            class="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100"
                            title="Duplicate question">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                    </button>
                    <button @click="removeQuestion(question.id)"
                            class="p-2 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                            title="Delete question">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
      </div>
      </div>
    </template>
    
    <!-- Add Question Button -->
    <div class="text-center py-8">
        <button @click="addQuestion()"
                class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Question
        </button>
    </div>
    </div>
  `
}

// Add custom styles for sliders
const style = document.createElement('style')
style.textContent = `
  /* Custom slider thumb */
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3B82F6;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .slider-thumb::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3B82F6;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: none;
  }
  
  /* Remove focus outline on sliders */
  input[type="range"]:focus {
    outline: none;
  }
`
document.head.appendChild(style)