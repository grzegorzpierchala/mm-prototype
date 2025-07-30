// Preview Page Component

export function PreviewPage() {
  const previewDataFunction = `() => {
  return {
    previewDevice: 'desktop',
    currentPage: 0,
    
    // Get questions for current page
    get paginatedQuestions() {
      const pages = this.getPages()
      return pages[this.currentPage] || []
    },
    
    // Get total number of pages
    get totalPages() {
      return this.getPages().length
    },
    
    // Split questions into pages based on page breaks
    getPages() {
      const pages = []
      let currentPageQuestions = []
      
      this.$store.survey.questions.forEach((question, index) => {
        currentPageQuestions.push({ ...question, originalIndex: index })
        
        // Check if there's a page break after this question
        if (this.$store.survey.hasPageBreakAfter(question.id)) {
          pages.push(currentPageQuestions)
          currentPageQuestions = []
        }
      })
      
      // Add remaining questions as the last page
      if (currentPageQuestions.length > 0) {
        pages.push(currentPageQuestions)
      }
      
      // If no questions or pages, create one empty page
      if (pages.length === 0) {
        pages.push([])
      }
      
      return pages
    },
    
    // Navigation methods
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
      }
    },
    
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    
    // Reset to first page when switching devices
    switchDevice(device) {
      this.previewDevice = device
      this.currentPage = 0
    }
  }
  }`
  return `
    <!-- Preview Tab Content -->
    <div x-show="$store.ui.activeTab === 'preview'" x-data="${previewDataFunction}">
      <!-- Device Selector (Subtle Segmented Control) -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex bg-gray-100 rounded-lg p-1">
          <button @click="switchDevice('desktop')" 
                  :class="previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''"
                  class="px-3 py-1.5 text-base font-medium rounded-md transition-all">
            Desktop
          </button>
          <button @click="switchDevice('tablet')" 
                  :class="previewDevice === 'tablet' ? 'bg-white shadow-sm' : ''"
                  class="px-3 py-1.5 text-base font-medium rounded-md transition-all">
            Tablet
          </button>
          <button @click="switchDevice('mobile')" 
                  :class="previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''"
                  class="px-3 py-1.5 text-base font-medium rounded-md transition-all">
            Mobile
          </button>
        </div>
      </div>
      
      <!-- Preview Container -->
      <div class="flex justify-center">
        <!-- Desktop Preview -->
        <div x-show="previewDevice === 'desktop'" x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 transform scale-95"
             x-transition:enter-end="opacity-100 transform scale-100"
             class="w-full max-w-3xl">
          <div class="bg-white rounded-lg shadow-lg">
            <!-- Survey Header -->
            <div class="px-8 py-6 border-b border-gray-200">
              <h1 class="text-2xl font-bold text-gray-900" x-text="$store.survey.title || 'Customer Satisfaction Survey'"></h1>
              <p class="mt-2 text-gray-600" x-text="$store.survey.description || 'Help us improve your dining experience by sharing your feedback'"></p>
            </div>
            
            <!-- Survey Content -->
            <div class="px-8 py-6 space-y-8">
              <template x-for="(question, index) in paginatedQuestions" :key="question.id">
                <div>
                  <div class="flex items-start space-x-3 mb-4">
                    <span class="text-base font-medium text-gray-500" x-text="(question.originalIndex + 1) + '.'"></span>
                    <h3 class="text-lg font-medium text-gray-900" x-text="question.text"></h3>
                  </div>
                  
                  <!-- Multiple Choice -->
                  <div x-show="question.type === 'multiple_choice'" class="ml-6 space-y-3">
                    <template x-for="option in question.options" :key="option.id">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" :name="'preview-' + question.id" class="text-indigo-600">
                        <span x-text="option.text"></span>
                      </label>
                    </template>
                  </div>
                  
                  <!-- Text Input -->
                  <div x-show="question.type === 'text_input'" class="ml-6">
                    <textarea placeholder="Type your answer here..." 
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              rows="4"></textarea>
                  </div>
                  
                  <!-- Long Text -->
                  <div x-show="question.type === 'long_text'" class="ml-6">
                    <textarea placeholder="Type your detailed answer here..." 
                              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                              rows="8"></textarea>
                    <div class="mt-2 text-sm text-gray-500 text-right">
                      <span>0</span> / <span x-text="question.settings?.maxLength || 500"></span> characters
                    </div>
                  </div>
                  
                  <!-- Checkbox -->
                  <div x-show="question.type === 'checkbox'" class="ml-6 space-y-3">
                    <template x-for="option in question.options" :key="option.id">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" :name="'preview-' + question.id" class="text-indigo-600 rounded">
                        <span x-text="option.text"></span>
                      </label>
                    </template>
                  </div>
                  
                  <!-- Yes/No -->
                  <div x-show="question.type === 'yes_no'" class="ml-6 space-y-3">
                    <label class="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" :name="'preview-' + question.id" class="text-indigo-600">
                      <span>Yes</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" :name="'preview-' + question.id" class="text-indigo-600">
                      <span>No</span>
                    </label>
                  </div>
                  
                  <!-- Dropdown -->
                  <div x-show="question.type === 'dropdown'" class="ml-6">
                    <select class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option>Select an option...</option>
                      <template x-for="option in question.options" :key="option.id">
                        <option x-text="option.text"></option>
                      </template>
                    </select>
                  </div>
                  
                  <!-- Star Rating -->
                  <div x-show="question.type === 'star_rating'" class="ml-6 flex gap-2">
                    <template x-for="i in 5">
                      <button class="text-3xl text-gray-300 hover:text-yellow-400 transition-colors">★</button>
                    </template>
                  </div>
                  
                  <!-- Number Scale -->
                  <div x-show="question.type === 'number_scale'" class="ml-6 flex gap-2">
                    <template x-for="i in (question.settings?.maxValue || 10)">
                      <button class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors font-medium text-sm"
                              x-text="i"></button>
                    </template>
                  </div>
                  
                  <!-- NPS Score -->
                  <div x-show="question.type === 'nps'" class="ml-6">
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
                  <div x-show="question.type === 'likert'" class="ml-6 flex gap-2 justify-between">
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Strongly Disagree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Disagree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Neutral</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Agree</button>
                    <button class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex-1">Strongly Agree</button>
                  </div>
                  
                  <!-- Slider -->
                  <div x-show="question.type === 'slider'" class="ml-6">
                    <input type="range" 
                           class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                           :min="question.settings?.minValue || 0" 
                           :max="question.settings?.maxValue || 100" 
                           value="50">
                    <div class="flex justify-between text-sm text-gray-500 mt-2">
                      <span x-text="question.settings?.minValue || 0"></span>
                      <span class="text-indigo-600 font-medium">50</span>
                      <span x-text="question.settings?.maxValue || 100"></span>
                    </div>
                  </div>
                  
                  <!-- Emoji Scale -->
                  <div x-show="question.type === 'emoji_scale'" class="ml-6 flex gap-3 justify-center text-4xl">
                    <button class="hover:scale-110 transition-transform">😢</button>
                    <button class="hover:scale-110 transition-transform">😟</button>
                    <button class="hover:scale-110 transition-transform">😐</button>
                    <button class="hover:scale-110 transition-transform">🙂</button>
                    <button class="hover:scale-110 transition-transform">😊</button>
                  </div>
                  
                  <!-- Number Input -->
                  <div x-show="question.type === 'number'" class="ml-6">
                    <input type="number" 
                           placeholder="Enter a number..." 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- Email Input -->
                  <div x-show="question.type === 'email'" class="ml-6">
                    <input type="email" 
                           placeholder="email@example.com" 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- Phone Input -->
                  <div x-show="question.type === 'phone'" class="ml-6">
                    <input type="tel" 
                           placeholder="+1 (555) 000-0000" 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- URL Input -->
                  <div x-show="question.type === 'url'" class="ml-6">
                    <input type="url" 
                           placeholder="https://example.com" 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- Date Input -->
                  <div x-show="question.type === 'date'" class="ml-6">
                    <input type="date" 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- Time Input -->
                  <div x-show="question.type === 'time'" class="ml-6">
                    <input type="time" 
                           class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  </div>
                  
                  <!-- Matrix Table -->
                  <div x-show="question.type === 'matrix'" class="ml-6 overflow-x-auto">
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
                          <td class="text-center p-2"><input type="radio" name="matrix-row1"></td>
                          <td class="text-center p-2"><input type="radio" name="matrix-row1"></td>
                          <td class="text-center p-2"><input type="radio" name="matrix-row1"></td>
                        </tr>
                        <tr class="border-t border-gray-100">
                          <td class="p-2 text-sm">Row 2</td>
                          <td class="text-center p-2"><input type="radio" name="matrix-row2"></td>
                          <td class="text-center p-2"><input type="radio" name="matrix-row2"></td>
                          <td class="text-center p-2"><input type="radio" name="matrix-row2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Ranking -->
                  <div x-show="question.type === 'ranking'" class="ml-6 space-y-2">
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-gray-400 cursor-move">⋮⋮</span>
                      <span class="font-medium text-gray-500">1.</span>
                      <span>First item to rank</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-gray-400 cursor-move">⋮⋮</span>
                      <span class="font-medium text-gray-500">2.</span>
                      <span>Second item to rank</span>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span class="text-gray-400 cursor-move">⋮⋮</span>
                      <span class="font-medium text-gray-500">3.</span>
                      <span>Third item to rank</span>
                    </div>
                  </div>
                  
                  <!-- Constant Sum -->
                  <div x-show="question.type === 'constant_sum'" class="ml-6 space-y-3">
                    <div class="flex items-center gap-3">
                      <input type="number" value="0" min="0" max="100" class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center">
                      <span class="flex-1">Option 1</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <input type="number" value="0" min="0" max="100" class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center">
                      <span class="flex-1">Option 2</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <input type="number" value="0" min="0" max="100" class="w-20 px-3 py-2 border border-gray-200 rounded-lg text-center">
                      <span class="flex-1">Option 3</span>
                    </div>
                    <div class="text-right mt-2 p-3 bg-gray-50 rounded-lg">
                      <span class="text-sm text-gray-600">Total: </span>
                      <span class="font-medium">0 / 100</span>
                    </div>
                  </div>
                  
                  <!-- File Upload -->
                  <div x-show="question.type === 'file_upload'" class="ml-6">
                    <div class="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-gray-300 transition-colors">
                      <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p class="text-gray-600 mb-2">Drop files here or click to upload</p>
                      <p class="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  
                  <!-- Image Choice -->
                  <div x-show="question.type === 'image_choice'" class="ml-6 grid grid-cols-3 gap-3">
                    <button class="relative group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-500 transition-colors">
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div class="p-2 text-sm text-center">Option 1</div>
                    </button>
                    <button class="relative group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-500 transition-colors">
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div class="p-2 text-sm text-center">Option 2</div>
                    </button>
                    <button class="relative group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-indigo-500 transition-colors">
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div class="p-2 text-sm text-center">Option 3</div>
                    </button>
                  </div>
                  
                  <!-- Signature -->
                  <div x-show="question.type === 'signature'" class="ml-6">
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div class="h-32 border-b-2 border-gray-300 relative">
                        <div class="absolute bottom-0 left-0 text-xs text-gray-400">Sign here</div>
                      </div>
                      <div class="mt-3 flex justify-end">
                        <button class="text-sm text-gray-500 hover:text-gray-700">Clear signature</button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Heat Map -->
                  <div x-show="question.type === 'heat_map'" class="ml-6">
                    <div class="relative bg-gray-100 rounded-lg overflow-hidden">
                      <div class="aspect-video flex items-center justify-center">
                        <div class="text-center">
                          <svg class="w-16 h-16 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-gray-500">Click anywhere on the image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Card Sort -->
                  <div x-show="question.type === 'card_sort'" class="ml-6 space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                      <h4 class="text-sm font-medium text-gray-700 mb-3">Items to sort:</h4>
                      <div class="flex flex-wrap gap-2">
                        <div class="px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-move">Item 1</div>
                        <div class="px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-move">Item 2</div>
                        <div class="px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-move">Item 3</div>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="p-4 border-2 border-dashed border-gray-200 rounded-lg min-h-[100px]">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Category A</h4>
                      </div>
                      <div class="p-4 border-2 border-dashed border-gray-200 rounded-lg min-h-[100px]">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Category B</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Survey Footer -->
            <div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div class="flex items-center gap-4">
                <button @click="previousPage()" 
                        :disabled="currentPage === 0"
                        :class="currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
                        class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg transition-colors">
                  Previous
                </button>
                <div class="text-base text-gray-500">
                  Page <span x-text="currentPage + 1"></span> of <span x-text="totalPages"></span>
                </div>
              </div>
              <button @click="currentPage < totalPages - 1 ? nextPage() : null"
                      :class="currentPage < totalPages - 1 ? 'hover:bg-indigo-700' : 'hover:bg-indigo-700'"
                      class="px-6 py-2 bg-indigo-600 text-white rounded-lg transition-colors"
                      x-text="currentPage < totalPages - 1 ? 'Next' : 'Submit'">
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tablet Preview -->
        <div x-show="previewDevice === 'tablet'" x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 transform scale-95"
             x-transition:enter-end="opacity-100 transform scale-100"
             class="relative">
          <!-- iPad Frame -->
          <div class="device-frame w-[768px] h-[1024px] bg-gray-900 rounded-[36px] p-4 shadow-2xl">
            <div class="w-full h-full bg-white rounded-[20px] overflow-hidden">
              <!-- Survey Content (Same as desktop but in frame) -->
              <div class="h-full overflow-y-auto">
                <div class="px-6 py-5 border-b border-gray-200">
                  <h1 class="text-xl font-bold text-gray-900" x-text="$store.survey.title || 'Customer Satisfaction Survey'"></h1>
                  <p class="mt-1 text-gray-600 text-base" x-text="$store.survey.description || 'Help us improve your dining experience by sharing your feedback'"></p>
                </div>
                <div class="px-6 py-5 space-y-6">
                  <template x-for="(question, index) in paginatedQuestions" :key="question.id">
                    <div>
                      <div class="flex items-start space-x-2 mb-3">
                        <span class="text-base font-medium text-gray-500" x-text="(question.originalIndex + 1) + '.'"></span>
                        <h3 class="text-base font-medium text-gray-900" x-text="question.text"></h3>
                      </div>
                      
                      <!-- Multiple Choice -->
                      <div x-show="question.type === 'multiple_choice'" class="ml-5 space-y-2">
                        <template x-for="option in question.options" :key="option.id">
                          <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" :name="'tablet-' + question.id" class="text-indigo-600">
                            <span class="text-base" x-text="option.text"></span>
                          </label>
                        </template>
                      </div>
                      
                      <!-- Text Input -->
                      <div x-show="question.type === 'text_input'" class="ml-5">
                        <textarea placeholder="Type your answer here..." 
                                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-base"
                                  rows="3"></textarea>
                      </div>
                      
                      <!-- Yes/No -->
                      <div x-show="question.type === 'yes_no'" class="ml-5 space-y-2">
                        <label class="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" :name="'tablet-' + question.id" class="text-indigo-600">
                          <span class="text-base">Yes</span>
                        </label>
                        <label class="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" :name="'tablet-' + question.id" class="text-indigo-600">
                          <span class="text-base">No</span>
                        </label>
                      </div>
                      
                      <!-- NPS Score -->
                      <div x-show="question.type === 'nps'" class="ml-5">
                        <div class="flex gap-1 flex-wrap">
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
                    </div>
                  </template>
                </div>
                <!-- Survey Footer -->
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div class="flex items-center gap-3">
                    <button @click="previousPage()" 
                            :disabled="currentPage === 0"
                            :class="currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
                            class="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg transition-colors">
                      Previous
                    </button>
                    <div class="text-sm text-gray-500">
                      Page <span x-text="currentPage + 1"></span> of <span x-text="totalPages"></span>
                    </div>
                  </div>
                  <button @click="currentPage < totalPages - 1 ? nextPage() : null"
                          :class="currentPage < totalPages - 1 ? 'hover:bg-indigo-700' : 'hover:bg-indigo-700'"
                          class="px-5 py-2 bg-indigo-600 text-white rounded-lg transition-colors text-base"
                          x-text="currentPage < totalPages - 1 ? 'Next' : 'Submit'">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mobile Preview -->
        <div x-show="previewDevice === 'mobile'" x-transition:enter="transition ease-out duration-300"
             x-transition:enter-start="opacity-0 transform scale-95"
             x-transition:enter-end="opacity-100 transform scale-100"
             class="relative"
             x-data="{ 
               get currentQuestion() {
                 return $store.survey.questions[currentPage * paginatedQuestions.length + currentQuestionInPage] || null
               },
               currentQuestionInPage: 0,
               get totalQuestionsInPage() {
                 return paginatedQuestions.length
               },
               get globalQuestionIndex() {
                 // Calculate the global index considering all pages
                 let index = 0
                 for (let i = 0; i < currentPage; i++) {
                   index += getPages()[i].length
                 }
                 return index + currentQuestionInPage
               },
               nextQuestion() {
                 if (currentQuestionInPage < totalQuestionsInPage - 1) {
                   currentQuestionInPage++
                 } else if (currentPage < totalPages - 1) {
                   nextPage()
                   currentQuestionInPage = 0
                 }
               },
               previousQuestion() {
                 if (currentQuestionInPage > 0) {
                   currentQuestionInPage--
                 } else if (currentPage > 0) {
                   previousPage()
                   currentQuestionInPage = getPages()[currentPage].length - 1
                 }
               },
               get isLastQuestion() {
                 return currentPage === totalPages - 1 && currentQuestionInPage === totalQuestionsInPage - 1
               }
             }">
          <!-- iPhone Frame -->
          <div class="device-frame w-[375px] h-[812px] bg-gray-900 rounded-[40px] p-3 shadow-2xl">
            <div class="w-full h-full bg-white rounded-[30px] overflow-hidden">
              <!-- Survey Content (Mobile optimized) -->
              <div class="h-full overflow-y-auto">
                <div class="px-4 py-4 border-b border-gray-200">
                  <h1 class="text-lg font-bold text-gray-900" x-text="$store.survey.title || 'Customer Satisfaction Survey'"></h1>
                  <p class="mt-1 text-gray-600 text-base" x-text="$store.survey.description || 'Help us improve your experience'"></p>
                </div>
                <div class="px-4 py-4 space-y-6">
                  <!-- Show current question only on mobile -->
                  <template x-if="paginatedQuestions[currentQuestionInPage]">
                    <div>
                      <div class="mb-4">
                        <span class="text-xs font-medium text-gray-500 block mb-2">Question <span x-text="globalQuestionIndex + 1"></span> of <span x-text="$store.survey.questions.length"></span></span>
                        <h3 class="text-base font-medium text-gray-900" x-text="paginatedQuestions[currentQuestionInPage].text"></h3>
                      </div>
                      
                      <!-- Multiple Choice -->
                      <div x-show="paginatedQuestions[currentQuestionInPage].type === 'multiple_choice'" class="space-y-3">
                        <template x-for="option in paginatedQuestions[currentQuestionInPage].options" :key="option.id">
                          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" :name="'mobile-q' + globalQuestionIndex" class="text-indigo-600 mr-3">
                            <span x-text="option.text"></span>
                          </label>
                        </template>
                      </div>
                      
                      <!-- Text Input -->
                      <div x-show="paginatedQuestions[currentQuestionInPage].type === 'text_input'">
                        <textarea placeholder="Type your answer here..." 
                                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-base"
                                  rows="4"></textarea>
                      </div>
                      
                      <!-- Yes/No -->
                      <div x-show="paginatedQuestions[currentQuestionInPage].type === 'yes_no'" class="space-y-3">
                        <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input type="radio" :name="'mobile-q' + globalQuestionIndex" class="text-indigo-600 mr-3">
                          <span>Yes</span>
                        </label>
                        <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                          <input type="radio" :name="'mobile-q' + globalQuestionIndex" class="text-indigo-600 mr-3">
                          <span>No</span>
                        </label>
                      </div>
                      
                      <!-- NPS Score -->
                      <div x-show="paginatedQuestions[currentQuestionInPage].type === 'nps'" class="space-y-3">
                        <div class="grid grid-cols-6 gap-1">
                          <template x-for="i in 11">
                            <button class="aspect-square rounded border border-gray-200 hover:border-indigo-500 transition-colors font-medium text-xs"
                                    :class="{
                                      'bg-red-50 text-red-600 border-red-200': i-1 <= 6,
                                      'bg-yellow-50 text-yellow-600 border-yellow-200': i-1 >= 7 && i-1 <= 8,
                                      'bg-green-50 text-green-600 border-green-200': i-1 >= 9
                                    }"
                                    x-text="i-1"></button>
                          </template>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                          <span>Not likely</span>
                          <span>Very likely</span>
                        </div>
                      </div>
                      
                      <div class="mt-6 flex justify-between">
                        <button class="text-gray-400" 
                                :class="{ 'opacity-50 cursor-not-allowed': globalQuestionIndex === 0 }"
                                :disabled="globalQuestionIndex === 0"
                                @click="previousQuestion()">Previous</button>
                        <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                x-text="isLastQuestion ? 'Submit' : 'Next'"
                                @click="isLastQuestion ? null : nextQuestion()"></button>
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
  `
}