import Alpine from 'alpinejs'

// Comment Store - Managing comments and threads
Alpine.store('comment', {
  // Comments organized by question ID
  threads: {
    'q1': [
      {
        id: 'c1',
        type: 'blocker',
        text: 'This question may violate GDPR requirements. We need to add a consent statement before collecting any satisfaction data.',
        author: 'Sarah Chen',
        role: 'Legal Review',
        avatar: 'SC',
        avatarColor: 'bg-purple-500',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved: false,
        unread: false,
        replies: []
      },
      {
        id: 'c2',
        type: 'suggestion',
        text: 'Consider adding a scale explanation for better clarity.',
        author: 'Mike Johnson',
        role: 'UX Designer',
        avatar: 'MJ',
        avatarColor: 'bg-green-500',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        resolved: true,
        unread: false,
        replies: [
          {
            id: 'r1',
            text: 'Good point! I\'ve added descriptions for each satisfaction level.',
            author: 'You',
            avatar: 'GP',
            avatarColor: 'bg-indigo-500',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            unread: false
          }
        ]
      }
    ],
    'q3': [
      {
        id: 'c3',
        type: 'question',
        text: 'Should we include a follow-up question asking why they gave this score?',
        author: 'Alex Rivera',
        role: 'Product Manager',
        avatar: 'AR',
        avatarColor: 'bg-blue-500',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        resolved: false,
        unread: true,
        replies: []
      },
      {
        id: 'c4',
        type: 'idea',
        text: 'We could use conditional logic to show different follow-ups based on their NPS score range.',
        author: 'Emily Zhang',
        role: 'Data Analyst',
        avatar: 'EZ',
        avatarColor: 'bg-pink-500',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        resolved: false,
        unread: true,
        replies: []
      }
    ]
  },
  
  // Comment types with colors and icons
  commentTypes: {
    blocker: { label: 'Blocker', color: 'red', icon: '🚫' },
    suggestion: { label: 'Suggestion', color: 'yellow', icon: '💡' },
    question: { label: 'Question', color: 'blue', icon: '❓' },
    idea: { label: 'Idea', color: 'purple', icon: '✨' },
    approval: { label: 'Approval', color: 'green', icon: '✅' },
    reference: { label: 'Reference', color: 'gray', icon: '📎' }
  },
  
  // New comment data
  newCommentType: 'suggestion',
  newCommentText: '',
  
  // Actions
  getCommentCount(questionId) {
    const threads = this.threads[questionId] || []
    return threads.reduce((count, comment) => {
      return count + 1 + (comment.replies?.length || 0)
    }, 0)
  },
  
  hasUnresolvedComments(questionId) {
    const threads = this.threads[questionId] || []
    return threads.some(comment => !comment.resolved && comment.type === 'blocker')
  },
  
  hasUnreadComments(questionId) {
    const threads = this.threads[questionId] || []
    return threads.some(comment => comment.unread || (comment.replies && comment.replies.some(reply => reply.unread)))
  },
  
  // Get count of unread comments and replies for a question
  getUnreadCount(questionId) {
    const threads = this.threads[questionId] || []
    let unreadCount = 0
    
    threads.forEach(comment => {
      // Count unread main comments
      if (comment.unread) {
        unreadCount++
      }
      
      // Count unread replies
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          if (reply.unread) {
            unreadCount++
          }
        })
      }
    })
    
    return unreadCount
  },
  
  addComment(questionId, commentData) {
    if (!this.threads[questionId]) {
      this.threads[questionId] = []
    }
    
    const newComment = {
      id: `c_${Date.now()}`,
      type: commentData.type || this.newCommentType,
      text: commentData.text,
      author: 'You',
      role: 'Survey Creator',
      avatar: 'GP',
      avatarColor: 'bg-indigo-500',
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    }
    
    this.threads[questionId].push(newComment)
    
    // Reset new comment
    this.newCommentText = ''
    this.newCommentType = 'suggestion'
    
    return newComment
  },
  
  addReply(questionId, commentId, replyText) {
    const thread = this.threads[questionId]
    if (!thread) return
    
    const comment = thread.find(c => c.id === commentId)
    if (!comment) return
    
    const reply = {
      id: `r_${Date.now()}`,
      text: replyText,
      author: 'You',
      avatar: 'GP',
      avatarColor: 'bg-indigo-500',
      timestamp: new Date().toISOString()
    }
    
    if (!comment.replies) {
      comment.replies = []
    }
    comment.replies.push(reply)
    
    return reply
  },
  
  resolveComment(questionId, commentId) {
    const thread = this.threads[questionId]
    if (!thread) return
    
    const comment = thread.find(c => c.id === commentId)
    if (comment) {
      comment.resolved = !comment.resolved
    }
  },
  
  deleteComment(questionId, commentId) {
    if (!this.threads[questionId]) return
    
    this.threads[questionId] = this.threads[questionId].filter(c => c.id !== commentId)
    
    // Remove thread if empty
    if (this.threads[questionId].length === 0) {
      delete this.threads[questionId]
    }
  },
  
  toggleCommentThread(questionId) {
    // This will be handled by the UI store to open/close the comment sidebar
    Alpine.store('ui').toggleCommentSidebar(questionId)
  },
  
  getParticipants(questionId) {
    const thread = this.threads[questionId]
    if (!thread || thread.length === 0) return []
    
    const participants = new Map()
    
    // Collect unique participants from comments and replies
    thread.forEach(comment => {
      // Add comment author
      if (!participants.has(comment.author)) {
        participants.set(comment.author, {
          name: comment.author,
          avatar: comment.avatar,
          avatarColor: comment.avatarColor
        })
      }
      
      // Add reply authors
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          if (!participants.has(reply.author)) {
            participants.set(reply.author, {
              name: reply.author,
              avatar: reply.avatar,
              avatarColor: reply.avatarColor
            })
          }
        })
      }
    })
    
    return Array.from(participants.values())
  }
})