// Results Page Component
export function ResultsPage() {
  return `
    <!-- Results Tab Content -->
    <div x-show="$store.ui.activeTab === 'results'" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 transform translate-y-4"
         x-transition:enter-end="opacity-100 transform translate-y-0"
         class="max-w-6xl mx-auto">
      
      <!-- Header Section with Key Metrics -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Survey Results</h2>
            <p class="text-base text-gray-600 mt-1">Analyze responses and track performance</p>
          </div>
          <div class="flex items-center space-x-3">
            <button class="px-4 py-2 text-base text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>Filter</span>
            </button>
            <button class="px-4 py-2 text-base text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base text-gray-600">Total Responses</p>
                <p class="text-3xl font-bold text-gray-900 mt-1" x-text="$store.results.totalResponses"></p>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4 text-sm">
              <span class="text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                +12%
              </span>
              <span class="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base text-gray-600">Response Rate</p>
                <p class="text-3xl font-bold text-gray-900 mt-1" x-text="$store.results.responseRate + '%'"></p>
              </div>
              <div class="p-3 bg-green-50 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4 text-sm">
              <span class="text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                +5.2%
              </span>
              <span class="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base text-gray-600">Avg Completion Time</p>
                <p class="text-3xl font-bold text-gray-900 mt-1" x-text="$store.results.avgCompletionTime + 'm'"></p>
              </div>
              <div class="p-3 bg-purple-50 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4 text-sm">
              <span class="text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
                -0.8m
              </span>
              <span class="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-base text-gray-600">Completion Rate</p>
                <p class="text-3xl font-bold text-gray-900 mt-1" x-text="$store.results.getCompletionRate() + '%'"></p>
              </div>
              <div class="p-3 bg-orange-50 rounded-lg">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center mt-4 text-sm">
              <span class="text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                +3.1%
              </span>
              <span class="text-gray-500 ml-2">vs last week</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Question Results Section -->
      <div class="space-y-8">
        <!-- Q1: Multiple Choice Results -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Q1: How satisfied were you with your overall dining experience?</h3>
              <p class="text-base text-gray-600 mt-1">Multiple Choice • 247 responses</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-indigo-600" x-text="$store.results.questionResults.q1.avgScore.toFixed(1)"></div>
              <div class="text-sm text-gray-500">Avg Score</div>
            </div>
          </div>
          
          <!-- Bar Chart Visualization -->
          <div class="space-y-4">
            <template x-for="response in $store.results.questionResults.q1.responses" :key="response.optionId">
              <div class="flex items-center">
                <div class="w-32 text-base text-gray-700 font-medium" x-text="response.optionText"></div>
                <div class="flex-1 mx-4">
                  <div class="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div class="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                         :style="'width: ' + response.percentage + '%'"></div>
                  </div>
                </div>
                <div class="w-16 text-right">
                  <div class="text-base font-semibold text-gray-900" x-text="response.count"></div>
                  <div class="text-sm text-gray-500" x-text="response.percentage.toFixed(1) + '%'"></div>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Summary Stats -->
          <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center space-x-6">
              <div>
                <div class="text-lg font-semibold text-green-600">75.7%</div>
                <div class="text-sm text-gray-500">Satisfied+</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-gray-600">14.2%</div>
                <div class="text-sm text-gray-500">Neutral</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-red-600">10.1%</div>
                <div class="text-sm text-gray-500">Dissatisfied</div>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              Overall sentiment: <span class="font-medium text-green-600">Positive</span>
            </div>
          </div>
        </div>
        
        <!-- Q2: Text Input Results -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Q2: What could we improve about your experience?</h3>
              <p class="text-base text-gray-600 mt-1">Text Input • 184 responses • 63 skipped</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600">60.9%</div>
              <div class="text-sm text-gray-500">Positive</div>
            </div>
          </div>
          
          <!-- Sentiment Breakdown -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600" x-text="$store.results.questionResults.q2.sentimentBreakdown.positive"></div>
              <div class="text-sm text-gray-600">Positive responses</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-gray-600" x-text="$store.results.questionResults.q2.sentimentBreakdown.neutral"></div>
              <div class="text-sm text-gray-600">Neutral responses</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600" x-text="$store.results.questionResults.q2.sentimentBreakdown.negative"></div>
              <div class="text-sm text-gray-600">Negative responses</div>
            </div>
          </div>
          
          <!-- Word Cloud Visualization -->
          <div class="mb-6">
            <h4 class="text-base font-medium text-gray-900 mb-4">Most Common Words</h4>
            <div class="flex flex-wrap gap-2">
              <template x-for="word in $store.results.questionResults.q2.wordCloud.slice(0, 10)" :key="word.word">
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                      :class="{
                        'bg-green-100 text-green-800': word.sentiment === 'positive',
                        'bg-gray-100 text-gray-700': word.sentiment === 'neutral' || word.sentiment === 'mixed',
                        'bg-red-100 text-red-800': word.sentiment === 'negative'
                      }"
                      :style="'font-size: ' + Math.max(12, Math.min(18, word.count / 2 + 12)) + 'px'"
                      x-text="word.word + ' (' + word.count + ')'">
                </span>
              </template>
            </div>
          </div>
          
          <!-- Recent Responses -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-4">Recent Responses</h4>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <template x-for="response in $store.results.questionResults.q2.responses.slice(0, 6)" :key="response.id">
                <div class="p-4 bg-gray-50 rounded-lg border-l-4"
                     :class="{
                       'border-green-400': response.sentiment === 'positive',
                       'border-gray-400': response.sentiment === 'neutral',
                       'border-red-400': response.sentiment === 'negative'
                     }">
                  <p class="text-base text-gray-700" x-text="response.text"></p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-sm text-gray-500" x-text="new Date(response.timestamp).toLocaleDateString()"></span>
                    <span class="text-xs px-2 py-1 rounded-full"
                          :class="{
                            'bg-green-100 text-green-700': response.sentiment === 'positive',
                            'bg-gray-100 text-gray-600': response.sentiment === 'neutral',
                            'bg-red-100 text-red-700': response.sentiment === 'negative'
                          }"
                          x-text="response.sentiment">
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Q3: Rating Scale (NPS) Results -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">Q3: How likely are you to recommend our restaurant to a friend?</h3>
              <p class="text-base text-gray-600 mt-1">Rating Scale (0-10) • 247 responses</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-indigo-600" x-text="$store.results.questionResults.q3.npsScore"></div>
              <div class="text-sm text-gray-500">NPS Score</div>
            </div>
          </div>
          
          <!-- NPS Breakdown -->
          <div class="grid grid-cols-3 gap-6 mb-6">
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600" x-text="$store.results.questionResults.q3.npsBreakdown.promoters"></div>
              <div class="text-sm text-gray-600">Promoters (9-10)</div>
              <div class="text-xs text-gray-500 mt-1" x-text="Math.round(($store.results.questionResults.q3.npsBreakdown.promoters / $store.results.questionResults.q3.totalResponses) * 100) + '%'"></div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600" x-text="$store.results.questionResults.q3.npsBreakdown.passives"></div>
              <div class="text-sm text-gray-600">Passives (7-8)</div>
              <div class="text-xs text-gray-500 mt-1" x-text="Math.round(($store.results.questionResults.q3.npsBreakdown.passives / $store.results.questionResults.q3.totalResponses) * 100) + '%'"></div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-2xl font-bold text-red-600" x-text="$store.results.questionResults.q3.npsBreakdown.detractors"></div>
              <div class="text-sm text-gray-600">Detractors (0-6)</div>
              <div class="text-xs text-gray-500 mt-1" x-text="Math.round(($store.results.questionResults.q3.npsBreakdown.detractors / $store.results.questionResults.q3.totalResponses) * 100) + '%'"></div>
            </div>
          </div>
          
          <!-- Distribution Chart -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-4">Score Distribution</h4>
            <div class="flex items-end space-x-1 h-32">
              <template x-for="response in $store.results.questionResults.q3.responses" :key="response.value">
                <div class="flex-1 flex flex-col items-center">
                  <div class="w-full bg-indigo-600 rounded-t transition-all duration-1000 ease-out"
                       :style="'height: ' + Math.max(4, (response.count / 52) * 100) + '%'"></div>
                  <div class="text-xs text-gray-600 mt-2" x-text="response.value"></div>
                  <div class="text-xs text-gray-500" x-text="response.count"></div>
                </div>
              </template>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mt-2">
              <span>Not at all likely</span>
              <span>Extremely likely</span>
            </div>
          </div>
          
          <!-- Summary Stats -->
          <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center space-x-6">
              <div>
                <div class="text-lg font-semibold text-gray-900" x-text="$store.results.questionResults.q3.avgScore"></div>
                <div class="text-sm text-gray-500">Average Score</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-gray-900" x-text="$store.results.questionResults.q3.distribution.median"></div>
                <div class="text-sm text-gray-500">Median</div>
              </div>
              <div>
                <div class="text-lg font-semibold text-gray-900" x-text="$store.results.questionResults.q3.distribution.mode"></div>
                <div class="text-sm text-gray-500">Mode</div>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              NPS Classification: <span class="font-medium text-green-600">Good</span>
            </div>
          </div>
        </div>
        
        <!-- Response Timeline -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h3 class="text-xl font-semibold text-gray-900 mb-6">Response Timeline</h3>
          <div class="flex items-end space-x-2 h-40">
            <template x-for="day in $store.results.responsesOverTime" :key="day.date">
              <div class="flex-1 flex flex-col items-center">
                <div class="w-full bg-indigo-600 rounded-t transition-all duration-1000 ease-out"
                     :style="'height: ' + Math.max(8, (day.responses / 52) * 100) + '%'"></div>
                <div class="text-xs text-gray-600 mt-2" x-text="new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })"></div>
                <div class="text-xs text-gray-500" x-text="day.responses"></div>
              </div>
            </template>
          </div>
          <div class="text-center mt-4">
            <span class="text-sm text-gray-500">Daily response count over the past week</span>
          </div>
        </div>
      </div>
    </div>
  `
}