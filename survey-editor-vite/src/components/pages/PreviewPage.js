// Preview Page Component
export function PreviewPage() {
  return `
    <!-- Preview Tab Content -->
    <div x-show="$store.ui.activeTab === 'preview'" x-data="{ previewDevice: 'desktop' }">
      <!-- Device Selector (Subtle Segmented Control) -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex bg-gray-100 rounded-lg p-1">
          <button @click="previewDevice = 'desktop'" 
                  :class="previewDevice === 'desktop' ? 'bg-white shadow-sm' : ''"
                  class="px-3 py-1.5 text-base font-medium rounded-md transition-all">
            Desktop
          </button>
          <button @click="previewDevice = 'tablet'" 
                  :class="previewDevice === 'tablet' ? 'bg-white shadow-sm' : ''"
                  class="px-3 py-1.5 text-base font-medium rounded-md transition-all">
            Tablet
          </button>
          <button @click="previewDevice = 'mobile'" 
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
              <h1 class="text-2xl font-bold text-gray-900" x-text="$store.survey.title.replace(' 2024', '')"></h1>
              <p class="mt-2 text-gray-600" x-text="$store.survey.description"></p>
            </div>
            
            <!-- Survey Content -->
            <div class="px-8 py-6 space-y-8">
              <template x-for="(question, index) in $store.survey.questions" :key="question.id">
                <div>
                  <div class="flex items-start space-x-3 mb-4">
                    <span class="text-base font-medium text-gray-500" x-text="(index + 1) + '.'"></span>
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
                  
                  <!-- NPS Score -->
                  <div x-show="question.type === 'nps'" class="ml-6">
                    <div class="flex gap-2">
                      <template x-for="i in 11">
                        <label class="cursor-pointer">
                          <input type="radio" :name="'preview-' + question.id" class="sr-only">
                          <span class="block w-12 h-12 rounded border-2 border-gray-300 hover:border-indigo-500 flex items-center justify-center font-medium transition-colors"
                                :class="{
                                  'bg-red-50 text-red-600 border-red-200': i-1 <= 6,
                                  'bg-yellow-50 text-yellow-600 border-yellow-200': i-1 >= 7 && i-1 <= 8,
                                  'bg-green-50 text-green-600 border-green-200': i-1 >= 9
                                }"
                                x-text="i-1"></span>
                        </label>
                      </template>
                    </div>
                    <div class="flex justify-between mt-2 text-sm text-gray-500">
                      <span>Not likely</span>
                      <span>Very likely</span>
                    </div>
                  </div>
                  
                  <!-- Rating Scale -->
                  <div x-show="question.type === 'rating_scale'" class="ml-6 flex gap-2">
                    <template x-for="i in 5">
                      <label class="cursor-pointer">
                        <input type="radio" :name="'preview-' + question.id" class="sr-only">
                        <span class="text-3xl text-gray-300 hover:text-yellow-400 transition-colors">★</span>
                      </label>
                    </template>
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
                </div>
              </template>
            </div>
            
            <!-- Survey Footer -->
            <div class="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div class="text-base text-gray-500">
                Page 1 of 1
              </div>
              <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Submit
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
                  <h1 class="text-xl font-bold text-gray-900" x-text="$store.survey.title.replace(' 2024', '')"></h1>
                  <p class="mt-1 text-gray-600 text-base" x-text="$store.survey.description"></p>
                </div>
                <div class="px-6 py-5 space-y-6">
                  <template x-for="(question, index) in $store.survey.questions" :key="question.id">
                    <div>
                      <div class="flex items-start space-x-2 mb-3">
                        <span class="text-base font-medium text-gray-500" x-text="(index + 1) + '.'"></span>
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
                    </div>
                  </template>
                </div>
                <!-- Survey Footer -->
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div class="text-base text-gray-500">
                    Page 1 of 1
                  </div>
                  <button class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-base">
                    Submit
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
             class="relative">
          <!-- iPhone Frame -->
          <div class="device-frame w-[375px] h-[812px] bg-gray-900 rounded-[40px] p-3 shadow-2xl">
            <div class="w-full h-full bg-white rounded-[30px] overflow-hidden">
              <!-- Survey Content (Mobile optimized) -->
              <div class="h-full overflow-y-auto">
                <div class="px-4 py-4 border-b border-gray-200">
                  <h1 class="text-lg font-bold text-gray-900" x-text="$store.survey.title.replace(' 2024', '')"></h1>
                  <p class="mt-1 text-gray-600 text-base">Help us improve your experience</p>
                </div>
                <div class="px-4 py-4 space-y-6">
                  <!-- Show first question only on mobile -->
                  <template x-if="$store.survey.questions[0]">
                    <div>
                      <div class="mb-4">
                        <span class="text-xs font-medium text-gray-500 block mb-2">Question 1 of <span x-text="$store.survey.questions.length"></span></span>
                        <h3 class="text-base font-medium text-gray-900" x-text="$store.survey.questions[0].text"></h3>
                      </div>
                      
                      <!-- Multiple Choice -->
                      <div x-show="$store.survey.questions[0].type === 'multiple_choice'" class="space-y-3">
                        <template x-for="option in $store.survey.questions[0].options" :key="option.id">
                          <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input type="radio" name="mobile-q1" class="text-indigo-600 mr-3">
                            <span x-text="option.text"></span>
                          </label>
                        </template>
                      </div>
                      
                      <div class="mt-6 flex justify-between">
                        <button class="text-gray-400" disabled>Previous</button>
                        <button class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Next</button>
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