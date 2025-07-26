// Comment Sidebar Component
export function CommentSidebar() {
  return `
    <!-- Comment Sidebar Overlay -->
    <div x-show="$store.ui.commentSidebarOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-1"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-1"
         x-transition:leave-end="opacity-0"
         @click="$store.ui.closeCommentSidebar()"
         class="comment-sidebar-overlay"
         :class="{ 'active': $store.ui.commentSidebarOpen }">
    </div>
    
    <!-- Comment Sidebar -->
    <div x-show="$store.ui.commentSidebarOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="transform translate-x-full"
         x-transition:enter-end="transform translate-x-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="transform translate-x-0"
         x-transition:leave-end="transform translate-x-full"
         class="comment-sidebar"
         :class="{ 'active': $store.ui.commentSidebarOpen }">
      
      <!-- Header -->
      <div class="comment-sidebar-header">
        <div class="comment-sidebar-title">
          <h3>Comments</h3>
          <button @click="$store.ui.closeCommentSidebar()" 
                  class="comment-sidebar-close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Question Context -->
        <div x-show="$store.ui.activeCommentQuestionId" class="comment-question-context">
          <template x-if="$store.ui.activeCommentQuestionId">
            <div>
              <div class="text-xs text-gray-500">
                <span x-text="$store.survey.questions.find(q => q.id === $store.ui.activeCommentQuestionId)?.questionNumber"></span>
              </div>
              <div class="comment-question-text" 
                   x-text="$store.survey.questions.find(q => q.id === $store.ui.activeCommentQuestionId)?.text || 'Untitled Question'">
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Comment List -->
      <div class="comment-sidebar-body">
        <template x-if="$store.ui.activeCommentQuestionId && $store.comment.threads[$store.ui.activeCommentQuestionId]">
          <div class="comment-list">
            <template x-for="comment in $store.comment.threads[$store.ui.activeCommentQuestionId]" :key="comment.id">
              <div class="comment-item" :class="{ 'resolved': comment.resolved }">
                <!-- Comment Type Badge -->
                <div x-show="comment.type" 
                     class="comment-badge"
                     :class="{
                       'blocker': comment.type === 'blocker',
                       'suggestion': comment.type === 'suggestion',
                       'question': comment.type === 'question',
                       'idea': comment.type === 'idea',
                       'approval': comment.type === 'approval',
                       'reference': comment.type === 'reference'
                     }">
                  <span x-text="$store.comment.commentTypes[comment.type]?.icon"></span>
                  <span x-text="$store.comment.commentTypes[comment.type]?.label"></span>
                </div>
                
                <!-- Author Info -->
                <div class="comment-author">
                  <div class="comment-avatar" 
                       :class="comment.avatarColor"
                       x-text="comment.avatar">
                  </div>
                  <div class="comment-meta">
                    <div class="comment-name" x-text="comment.author"></div>
                    <div class="comment-role" x-text="comment.role"></div>
                  </div>
                  <div class="comment-time" 
                       x-text="new Date(comment.timestamp).toLocaleString('en-US', { 
                         month: 'short', 
                         day: 'numeric', 
                         hour: 'numeric', 
                         minute: '2-digit' 
                       })">
                  </div>
                </div>
                
                <!-- Comment Body -->
                <div class="comment-body" x-text="comment.text"></div>
                
                <!-- Comment Actions -->
                <div class="comment-actions">
                  <button @click="$store.comment.resolveComment($store.ui.activeCommentQuestionId, comment.id)"
                          class="comment-action">
                    <span x-show="!comment.resolved">Mark as resolved</span>
                    <span x-show="comment.resolved">Unresolve</span>
                  </button>
                  <button @click="comment.showReply = !comment.showReply"
                          class="comment-action">
                    Reply
                  </button>
                  <button @click="$store.comment.deleteComment($store.ui.activeCommentQuestionId, comment.id)"
                          class="comment-action text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </div>
                
                <!-- Replies -->
                <div x-show="comment.replies && comment.replies.length > 0" class="mt-3 ml-9 space-y-2">
                  <template x-for="reply in comment.replies" :key="reply.id">
                    <div class="bg-gray-50 rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="comment-avatar w-6 h-6 text-xs" 
                             :class="reply.avatarColor"
                             x-text="reply.avatar">
                        </div>
                        <span class="text-sm font-medium" x-text="reply.author"></span>
                        <span class="text-xs text-gray-500" 
                              x-text="new Date(reply.timestamp).toLocaleString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: 'numeric', 
                                minute: '2-digit' 
                              })">
                        </span>
                      </div>
                      <div class="text-sm text-gray-700" x-text="reply.text"></div>
                    </div>
                  </template>
                </div>
                
                <!-- Reply Form -->
                <div x-show="comment.showReply" 
                     x-data="{ replyText: '' }"
                     class="mt-3 ml-9">
                  <textarea 
                    x-model="replyText"
                    @keydown.enter.meta="if(replyText.trim()) { $store.comment.addReply($store.ui.activeCommentQuestionId, comment.id, replyText); replyText = ''; comment.showReply = false; }"
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="2"
                    placeholder="Write a reply..."></textarea>
                  <div class="mt-2 flex justify-end gap-2">
                    <button @click="comment.showReply = false; replyText = ''"
                            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                      Cancel
                    </button>
                    <button @click="if(replyText.trim()) { $store.comment.addReply($store.ui.activeCommentQuestionId, comment.id, replyText); replyText = ''; comment.showReply = false; }"
                            class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        
        <!-- Empty State -->
        <div x-show="!$store.ui.activeCommentQuestionId || !$store.comment.threads[$store.ui.activeCommentQuestionId] || $store.comment.threads[$store.ui.activeCommentQuestionId].length === 0"
             class="flex flex-col items-center justify-center h-full text-gray-400">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
            </path>
          </svg>
          <p class="text-sm">No comments yet</p>
          <p class="text-xs mt-1">Be the first to add feedback</p>
        </div>
      </div>
      
      <!-- New Comment Form -->
      <div class="comment-sidebar-footer">
        <!-- Comment Type Selector -->
        <div class="comment-type-selector">
          <template x-for="(type, key) in $store.comment.commentTypes" :key="key">
            <button @click="$store.comment.newCommentType = key"
                    class="comment-type-option"
                    :class="{ 'selected': $store.comment.newCommentType === key }">
              <span x-text="type.icon"></span>
              <span x-text="type.label"></span>
            </button>
          </template>
        </div>
        
        <!-- Comment Input -->
        <textarea 
          x-model="$store.comment.newCommentText"
          @keydown.enter.meta="if($store.comment.newCommentText.trim() && $store.ui.activeCommentQuestionId) { 
            $store.comment.addComment($store.ui.activeCommentQuestionId, { 
              type: $store.comment.newCommentType, 
              text: $store.comment.newCommentText 
            }); 
          }"
          class="comment-textarea"
          placeholder="Add a comment..."></textarea>
        
        <!-- Submit Button -->
        <div class="comment-submit">
          <div class="text-xs text-gray-500">
            <kbd class="kbd text-xs">⌘</kbd> + <kbd class="kbd text-xs">Enter</kbd> to submit
          </div>
          <button @click="if($store.comment.newCommentText.trim() && $store.ui.activeCommentQuestionId) { 
                    $store.comment.addComment($store.ui.activeCommentQuestionId, { 
                      type: $store.comment.newCommentType, 
                      text: $store.comment.newCommentText 
                    }); 
                  }"
                  :disabled="!$store.comment.newCommentText.trim() || !$store.ui.activeCommentQuestionId"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Comment
          </button>
        </div>
      </div>
    </div>
  `
}