// Main Layout Component - Container for different tab content
import { QuestionRenderer } from '../questions/QuestionRenderer'
import { PreviewPage } from '../pages/PreviewPage'
import { SharePage } from '../pages/SharePage'
import { SettingsPage } from '../pages/SettingsPage'
import { FlowPage } from '../pages/FlowPage'
import { ResultsPage } from '../pages/ResultsPage'

export function MainLayout() {
  return `
    <main class="px-6 py-8">
      
      <!-- Build Tab Content -->
      <div x-show="$store.ui.activeTab === 'build'" 
           class="max-w-4xl mx-auto relative">
        
        <!-- Survey Title and Description -->
        <div class="mb-8">
          <input type="text" 
                 x-model="$store.survey.title"
                 @input="debouncedAutosave"
                 class="text-3xl font-bold text-gray-900 mb-2 w-full bg-transparent border-0 focus:bg-gray-50 px-2 -mx-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 placeholder="Survey Title">
          <input type="text"
                 x-model="$store.survey.description"
                 @input="debouncedAutosave"
                 class="text-gray-600 w-full bg-transparent border-0 focus:bg-gray-50 px-2 -mx-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 placeholder="Survey description...">
        </div>

        <!-- Blocks Container -->
        <div class="space-y-4">
          <!-- Question Blocks -->
          ${QuestionRenderer()}
          
          <!-- Add Block Button -->
          <div class="flex items-center justify-center py-8">
            <div class="relative inline-block"
                 x-data="{ 
                   showAddQuestionDropdown: false,
                   calculateDropdownPosition() {
                     const button = $el.querySelector('button');
                     const rect = button.getBoundingClientRect();
                     const viewportHeight = window.innerHeight;
                     const spaceBelow = viewportHeight - rect.bottom;
                     const dropdownHeight = 500; // Approximate max height
                     
                     return spaceBelow < dropdownHeight && rect.top > dropdownHeight ? 'above' : 'below';
                   }
                 }">
              <button @click="showAddQuestionDropdown = !showAddQuestionDropdown"
                      class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 font-medium">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Add Question</span>
              </button>
              
              <!-- Add Question Type Dropdown -->
              <div x-show="showAddQuestionDropdown" 
                   x-transition:enter="transition ease-out duration-200"
                   x-transition:enter-start="opacity-0 scale-95"
                   x-transition:enter-end="opacity-100 scale-100"
                   @click.away="showAddQuestionDropdown = false"
                   @keydown.escape="showAddQuestionDropdown = false"
                   :class="{
                     'bottom-full mb-2': calculateDropdownPosition() === 'above',
                     'top-full mt-2': calculateDropdownPosition() === 'below'
                   }"
                   class="absolute left-1/2 transform -translate-x-1/2 w-80 max-h-[500px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                
                <div class="max-h-[500px] overflow-y-auto">
                  <!-- Recently Used (if available) -->
                  <div x-show="$store.ui.recentlyUsedTypes && $store.ui.recentlyUsedTypes.length > 0" class="border-b border-gray-100">
                    <div class="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Recently Used</div>
                    <template x-for="typeId in ($store.ui.recentlyUsedTypes || [])" :key="'add-recent-' + typeId">
                      <button @click="$dispatch('add-question', { type: typeId }); showAddQuestionDropdown = false"
                              class="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                              x-show="['text_input', 'long_text', 'multiple_choice', 'checkbox', 'dropdown', 'yes_no', 'star_rating', 'number_scale', 'nps', 'likert', 'slider', 'emoji_scale', 'number', 'email', 'phone', 'url', 'date', 'time', 'matrix', 'ranking', 'constant_sum', 'max_diff', 'side_by_side', 'card_sort', 'file_upload', 'image_choice', 'signature', 'drawing', 'video_response', 'audio_response', 'heat_map', 'hot_spot', 'map_location', 'priority_grid'].includes(typeId)">
                        <span class="text-2xl" x-text="{
                          'text_input': '💬', 'long_text': '📝', 'multiple_choice': '🔘', 'checkbox': '☑️', 
                          'dropdown': '▼', 'yes_no': '👍', 'star_rating': '⭐', 'number_scale': '🔢',
                          'nps': '🎯', 'likert': '📊', 'slider': '🎚️', 'emoji_scale': '😊',
                          'number': '💯', 'email': '✉️', 'phone': '📱', 'url': '🌐',
                          'date': '📅', 'time': '🕐', 'matrix': '⊞', 'ranking': '📋',
                          'constant_sum': '💯', 'max_diff': '⚖️', 'side_by_side': '📊', 'card_sort': '🗂️',
                          'file_upload': '📎', 'image_choice': '🖼️', 'signature': '✍️', 'drawing': '🎨',
                          'video_response': '📹', 'audio_response': '🎤', 'heat_map': '🔥', 'hot_spot': '🎯',
                          'map_location': '📍', 'priority_grid': '⊞'
                        }[typeId]"></span>
                        <div class="flex-1">
                          <div class="font-medium text-gray-900" x-text="{
                            'text_input': 'Short Text', 'long_text': 'Long Text', 'multiple_choice': 'Multiple Choice',
                            'checkbox': 'Checkboxes', 'dropdown': 'Dropdown', 'yes_no': 'Yes/No',
                            'star_rating': 'Star Rating', 'number_scale': 'Number Scale', 'nps': 'NPS Score',
                            'likert': 'Likert Scale', 'slider': 'Slider', 'emoji_scale': 'Emoji Scale',
                            'number': 'Number', 'email': 'Email', 'phone': 'Phone', 'url': 'Website',
                            'date': 'Date', 'time': 'Time', 'matrix': 'Matrix Table', 'ranking': 'Rank Order',
                            'constant_sum': 'Constant Sum', 'max_diff': 'MaxDiff', 'side_by_side': 'Side by Side',
                            'card_sort': 'Card Sort', 'file_upload': 'File Upload', 'image_choice': 'Image Choice',
                            'signature': 'Signature', 'drawing': 'Drawing', 'video_response': 'Video',
                            'audio_response': 'Audio', 'heat_map': 'Heat Map', 'hot_spot': 'Hot Spot',
                            'map_location': 'Map Location', 'priority_grid': 'Priority Grid'
                          }[typeId]"></div>
                        </div>
                        <span class="text-yellow-500">★</span>
                      </button>
                    </template>
                  </div>
                  
                  <!-- Main question types by category -->
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
                  }" :key="'add-cat-' + category">
                    <div class="border-b border-gray-100 last:border-b-0">
                      <div class="px-3 py-2 text-xs font-medium text-gray-500 uppercase" 
                           x-text="category.charAt(0).toUpperCase() + category.slice(1)"></div>
                      <template x-for="type in types" :key="'add-type-' + type.id">
                        <button @click="$dispatch('add-question', { type: type.id }); showAddQuestionDropdown = false"
                                class="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                          <span class="text-2xl" x-text="type.icon"></span>
                          <div class="flex-1">
                            <div class="font-medium text-gray-900" x-text="type.name"></div>
                          </div>
                        </button>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${FlowPage()}

      ${PreviewPage()}

      ${SharePage()}

      ${ResultsPage()}

      ${SettingsPage()}

    </main>
  `
}