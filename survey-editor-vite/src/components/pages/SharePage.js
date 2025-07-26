// Share Page Component
export function SharePage() {
  return `
    <!-- Share Tab Content -->
    <div x-show="$store.ui.activeTab === 'share'" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 transform translate-y-4"
         x-transition:enter-end="opacity-100 transform translate-y-0"
         class="max-w-4xl mx-auto" 
         x-data="{ copied: false, copiedEmbed: false }">
      <div class="space-y-12">
        <!-- Direct Link Section -->
        <div>
          <h3 class="text-base font-medium text-gray-900 mb-4">Share Link</h3>
          <div class="flex items-center space-x-3">
            <div class="flex-1 relative">
              <input type="text" 
                     value="https://surveys.mindful.com/s/abc123" 
                     readonly 
                     class="w-full px-4 py-2.5 pr-12 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <button @click="navigator.clipboard.writeText('https://surveys.mindful.com/s/abc123'); copied = true; setTimeout(() => copied = false, 2000)"
                      class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg x-show="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <svg x-show="copied" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- QR Code & Embed Section -->
        <div class="grid grid-cols-2 gap-8">
          <!-- QR Code -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-4">QR Code</h3>
            <div class="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow">
              <div class="bg-gray-50 h-48 w-48 mx-auto rounded-lg flex items-center justify-center">
                <span class="text-gray-400 text-base">[QR Code]</span>
              </div>
              <button class="mt-6 text-base text-indigo-600 hover:text-indigo-700 font-medium">
                Download PNG
              </button>
            </div>
          </div>
          
          <!-- Embed Code -->
          <div>
            <h3 class="text-base font-medium text-gray-900 mb-4">Embed Code</h3>
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <pre class="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto font-mono text-gray-600"><code>&lt;iframe 
  src="https://surveys.mindful.com/s/abc123"
  width="100%" 
  height="600"
  frameborder="0"&gt;
&lt;/iframe&gt;</code></pre>
              <button @click="navigator.clipboard.writeText('<iframe src=&quot;https://surveys.mindful.com/s/abc123&quot; width=&quot;100%&quot; height=&quot;600&quot; frameborder=&quot;0&quot;></iframe>'); copiedEmbed = true; setTimeout(() => copiedEmbed = false, 2000)"
                      class="mt-4 text-base text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-2">
                <span x-text="copiedEmbed ? 'Copied!' : 'Copy embed code'"></span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Team Sharing Section -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-4">Team Access</h3>
          <div class="space-y-4">
            <!-- Invite Form -->
            <div class="bg-white rounded-xl shadow-sm p-4">
              <div class="flex items-center space-x-3">
                <input type="email" 
                       placeholder="Add people by email" 
                       class="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white">
                <select class="px-3 py-2 bg-gray-50 border-0 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Can edit</option>
                  <option>Can view</option>
                  <option>Can comment</option>
                </select>
                <button class="px-4 py-2 bg-indigo-600 text-white text-base rounded-lg hover:bg-indigo-700 transition-colors">
                  Send invite
                </button>
              </div>
            </div>
            
            <!-- Team Members -->
            <div class="space-y-1">
              <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-base font-medium">SC</div>
                  <div>
                    <div class="text-base font-medium text-gray-900">Sarah Chen</div>
                    <div class="text-base text-gray-500">sarah@company.com</div>
                  </div>
                </div>
                <select class="px-2 py-1 text-xs bg-transparent border border-gray-200 rounded-lg text-gray-600 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Can edit</option>
                  <option>Can view</option>
                  <option>Can comment</option>
                </select>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-base font-medium">MJ</div>
                  <div>
                    <div class="text-base font-medium text-gray-900">Mike Johnson</div>
                    <div class="text-base text-gray-500">mike@company.com</div>
                  </div>
                </div>
                <select class="px-2 py-1 text-xs bg-transparent border border-gray-200 rounded-lg text-gray-600 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Can view</option>
                  <option selected>Can edit</option>
                  <option>Can comment</option>
                </select>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-base font-medium">GP</div>
                  <div>
                    <div class="text-base font-medium text-gray-900">You</div>
                    <div class="text-base text-gray-500">Owner</div>
                  </div>
                </div>
                <span class="text-xs text-gray-500">Owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}