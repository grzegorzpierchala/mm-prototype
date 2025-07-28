// Main survey editor Alpine component
import { initKeyboardShortcuts } from '../utils/keyboardShortcuts'

export default function surveyEditor() {
  return {
    // Local state that doesn't need to be in stores
    showQuestionTypes: null,
    highlightedType: null,
    duplicateQuestions: [],
    showSlashMenu: false,
    keyboardShortcuts: null,
    
    // Initialize
    init() {
      console.log('Survey Editor initialized')
      // Initialize auto-save
      this.$store.ui.initAutoSave()
      // Initialize keyboard shortcuts
      this.keyboardShortcuts = initKeyboardShortcuts()
      
      // Listen for change-question-type event from QuestionRenderer
      this.$el.addEventListener('change-question-type', (event) => {
        const { questionId, newType } = event.detail
        this.changeQuestionType(questionId, newType)
      })
      
      // Listen for validate-question-number event
      this.$el.addEventListener('validate-question-number', (event) => {
        const { questionId } = event.detail
        this.validateQuestionNumber(questionId)
      })
      
      // Listen for add-question event
      this.$el.addEventListener('add-question', (event) => {
        const { type } = event.detail
        this.addQuestion(type)
      })
    },
    
    // Question Management
    addQuestion(type = 'text_input') {
      const newQuestion = {
        id: `q_${Date.now()}`,
        type: type,
        text: '',
        questionNumber: `Q${this.$store.survey.questions.length + 1}`,
        required: false,
        options: type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown'
          ? [
              { id: `opt_${Date.now()}_1`, text: 'Option 1' },
              { id: `opt_${Date.now()}_2`, text: 'Option 2' }
            ] 
          : [],
        settings: this.getDefaultSettings(type),
        validation: this.getDefaultValidation(type)
      }
      
      this.$store.survey.addQuestion(newQuestion)
      this.$store.ui.selectQuestion(newQuestion.id)
      this.$store.ui.openSettingsPanel(newQuestion.id)
      
      // Track recently used types
      this.trackRecentlyUsedType(type)
    },
    
    // Get default settings for question type
    getDefaultSettings(type) {
      const defaults = {
        // Essential Question Types
        text_input: { 
          textType: 'single_line', // single_line, multiple_lines, essay_box, password, autocomplete
          placeholder: 'Type your answer here...', 
          maxLength: 200,
          characterCount: true,
          autocompleteList: [],
          conversationalFeedback: false
        },
        long_text: { 
          placeholder: 'Type your detailed answer here...', 
          maxLength: 500, 
          rows: 4,
          resizable: true,
          characterCount: true,
          wordCount: false,
          richText: false
        },
        multiple_choice: { 
          answerType: 'single', // single, multiple
          format: 'list', // list, dropdown, select_box
          layout: 'vertical', // vertical, horizontal, columns
          columns: 2,
          labelPosition: 'side', // side, above
          randomizeOptions: false,
          allowTextEntry: {},  // per-option setting
          makeExclusive: {},   // per-option setting
          useSuggestedChoices: false
        },
        checkbox: { 
          minSelections: 0, 
          maxSelections: null,
          selectAllOption: false,
          layout: 'vertical', // vertical, grid
          columns: 2,
          exclusiveOptions: [] // option IDs that are exclusive
        },
        dropdown: { 
          placeholder: 'Select an option...',
          searchable: false,
          multiSelect: false,
          cascading: false,
          parentQuestion: null,
          groupOptions: false
        },
        yes_no: { 
          labels: { yes: 'Yes', no: 'No', maybe: null },
          displayFormat: 'buttons', // buttons, toggle, radio
          includeIcons: false,
          customIcons: { yes: '👍', no: '👎' }
        },
        
        // Rating Question Types
        star_rating: { 
          maxStars: 5,
          interaction: 'discrete', // discrete, half_step, continuous
          customIcon: '⭐',
          showNumericValue: false,
          color: '#FFD700'
        },
        number_scale: { 
          minValue: 1, 
          maxValue: 10, 
          labels: { min: '', max: '' },
          layout: 'horizontal', // horizontal, vertical
          displayAs: 'buttons', // buttons, slider
          notApplicable: false
        },
        nps: { 
          minValue: 0, 
          maxValue: 10,
          labels: { min: 'Not likely', max: 'Very likely' },
          followUpQuestion: false,
          colorScheme: 'standard', // standard, custom
          showGrouping: true
        },
        likert: { 
          scalePoints: 5,
          scaleType: 'agreement', // agreement, frequency, importance, satisfaction
          labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
          bipolar: false,
          removeMidpoint: false,
          matrixIntegration: false
        },
        slider: { 
          type: 'sliders', // bars, sliders, stars
          min: 0, 
          max: 100, 
          step: 1, 
          showValue: true,
          increments: 10,
          snapToIncrements: false,
          notApplicable: false,
          showLabels: false,
          labelCount: 3,
          statements: [] // for multiple sliders
        },
        emoji_scale: { 
          emojis: ['😡', '😟', '😐', '😊', '😍'],
          customEmojis: false,
          animated: true,
          showTooltips: true,
          tooltips: ['Very Unhappy', 'Unhappy', 'Neutral', 'Happy', 'Very Happy']
        },
        
        // Input Question Types
        number: {
          min: null,
          max: null,
          decimals: 0,
          showIncrementButtons: true,
          thousandSeparator: true,
          format: 'number', // number, currency, percentage
          currencySymbol: '$',
          currencyPosition: 'before' // before, after
        },
        email: {
          domainValidation: false,
          allowMultiple: false,
          autoComplete: true,
          verifyEmail: false,
          customErrorMessage: 'Please enter a valid email address'
        },
        phone: {
          internationalFormat: true,
          countryCode: true,
          defaultCountry: 'US',
          formatMask: true,
          smsVerification: false,
          extensionField: false
        },
        url: {
          protocolRequired: true,
          linkPreview: false,
          socialMediaDetection: false,
          qrCodeGeneration: false,
          shortenUrl: false
        },
        date: {
          format: 'MM/DD/YYYY',
          dateRange: false,
          blackoutDates: [],
          minDate: null,
          maxDate: null,
          relativeDateOptions: false,
          calendarView: 'month' // month, year, decade
        },
        time: {
          format: '12h', // 12h, 24h
          timeZone: false,
          defaultTimeZone: null,
          durationInput: false,
          timeSlots: false,
          slotDuration: 30, // minutes
          appointmentMode: false
        },
        
        // Advanced Question Types
        matrix: {
          matrixType: 'likert', // likert, bipolar, rank_order, constant_sum, text_entry, max_diff, profile
          answerType: 'single', // single, multiple, dropdown, drag_drop
          scalePoints: [
            { id: 'col_1', text: 'Strongly Disagree' },
            { id: 'col_2', text: 'Disagree' },
            { id: 'col_3', text: 'Neutral' },
            { id: 'col_4', text: 'Agree' },
            { id: 'col_5', text: 'Strongly Agree' }
          ],
          statements: [
            { id: 'row_1', text: 'The product quality meets my expectations' },
            { id: 'row_2', text: 'The customer service is responsive' },
            { id: 'row_3', text: 'The pricing is fair for the value' }
          ],
          transposeTable: false,
          repeatHeaders: 'none', // none, all, middle, bottom, both
          columnGroups: [],
          carouselMode: false,
          carouselAutoAdvance: false
        },
        ranking: {
          rankingMethod: 'drag_drop', // drag_drop, number_input
          forceAllRanked: true,
          allowTies: false,
          showNumbers: true,
          visualFeedback: true,
          maxItems: null
        },
        constant_sum: {
          total: 100,
          showTotalBox: true,
          totalBoxPosition: 'bottom', // bottom, right
          symbol: '',
          symbolPosition: 'before', // before, after
          minPerItem: 0,
          maxPerItem: null,
          decimals: 0,
          visualBars: false
        },
        max_diff: {
          itemsPerSet: 4,
          adaptiveSets: false,
          showBestWorst: true,
          highlightSelected: true,
          progressIndicator: true,
          analysisPreview: false
        },
        side_by_side: {
          columns: [],
          sharedHeaders: true,
          columnTypes: [], // text, radio, checkbox, dropdown, number
          responsiveDesign: true,
          exportFormat: 'table'
        },
        card_sort: {
          sortType: 'open', // open, closed, hybrid
          categories: [],
          allowCreateCategories: true,
          dragDropInterface: true,
          timeTracking: true,
          showHeatmap: false,
          maxCardsPerCategory: null
        },
        
        // Media Question Types
        file_upload: {
          allowMultiple: true,
          maxFiles: 5,
          fileTypes: ['image/*', 'application/pdf'],
          maxFileSize: 10, // MB
          showProgress: true,
          previewFiles: true,
          virusScan: true
        },
        image_choice: {
          layout: 'grid', // grid, list, carousel
          columns: 3,
          multiSelect: false,
          imageSize: 'medium', // small, medium, large
          showCaptions: true,
          zoomOnHover: true,
          lazyLoad: true
        },
        signature: {
          signatureType: 'draw', // draw, type, both
          canvasWidth: 400,
          canvasHeight: 200,
          penColor: '#000000',
          penWidth: 2,
          showClearButton: true,
          showUndoButton: true,
          legalDisclaimer: '',
          timestampSignature: true
        },
        drawing: {
          canvasWidth: 600,
          canvasHeight: 400,
          tools: ['pen', 'eraser', 'shapes', 'text'],
          colors: ['#000000', '#FF0000', '#00FF00', '#0000FF'],
          shapes: ['rectangle', 'circle', 'line', 'arrow'],
          showUndo: true,
          showRedo: true,
          saveFormat: 'png' // png, jpeg, svg
        },
        video_response: {
          recordingMethod: 'both', // record, upload, both
          maxDuration: 300, // seconds
          showPreview: true,
          allowRetake: true,
          compression: 'auto',
          transcription: false,
          backgroundBlur: false
        },
        audio_response: {
          recordingMethod: 'both', // record, upload, both
          maxDuration: 180, // seconds
          noiseCancellation: true,
          showWaveform: true,
          allowRetake: true,
          transcription: false,
          audioFormat: 'mp3'
        },
        
        // Interactive Question Types
        heat_map: {
          image: '',
          clickTracking: true,
          multipleClicks: false,
          regionDefinition: 'automatic', // automatic, manual
          intensityVisualization: true,
          showClickCount: true,
          exportFormat: 'csv'
        },
        hot_spot: {
          image: '',
          regions: [],
          multipleSelection: false,
          showFeedback: true,
          highlightOnHover: true,
          tooltips: true,
          accessibilityMode: true
        },
        map_location: {
          mapProvider: 'google', // google, mapbox, openstreetmap
          searchEnabled: true,
          pinPlacement: true,
          radiusSelection: false,
          multipleLocations: false,
          addressLookup: true,
          geofencing: false
        },
        priority_grid: {
          xAxisLabel: 'Importance',
          yAxisLabel: 'Performance',
          quadrantLabels: ['Low Priority', 'Maintain', 'Concentrate Here', 'Possible Overkill'],
          itemLimit: 20,
          itemsPerQuadrant: null,
          showGuides: true,
          snapToGrid: false
        }
      }
      
      return defaults[type] || {}
    },
    
    // Get default validation for question type
    getDefaultValidation(type) {
      const defaults = {
        // Essential Types
        text_input: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          pattern: '', 
          patternError: '', 
          minLength: null,
          maxLength: 200,
          customRules: []
        },
        long_text: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          minLength: null,
          maxLength: 500,
          minWords: null,
          maxWords: null
        },
        multiple_choice: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select an option', 
          minSelections: 1, 
          maxSelections: 1,
          customValidation: []
        },
        checkbox: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select at least one option', 
          minSelections: 1, 
          maxSelections: null,
          exactSelections: null
        },
        dropdown: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select an option'
        },
        yes_no: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select an answer'
        },
        
        // Rating Types
        star_rating: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please provide a rating',
          minRating: null
        },
        number_scale: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a number'
        },
        nps: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a score'
        },
        likert: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a response for all items',
          allItemsRequired: true
        },
        slider: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please move the slider to provide a response',
          allSlidersRequired: true
        },
        emoji_scale: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select an emoji'
        },
        
        // Input Types
        email: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          pattern: '^[^@]+@[^@]+\\.[^@]+$', 
          patternError: 'Please enter a valid email',
          domainWhitelist: [],
          domainBlacklist: []
        },
        phone: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          pattern: '', 
          patternError: 'Please enter a valid phone number',
          countryValidation: true
        },
        url: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          pattern: '^https?://', 
          patternError: 'Please enter a valid URL',
          domainWhitelist: [],
          domainBlacklist: []
        },
        number: { 
          forceResponse: false,
          requestResponse: false,
          requiredError: 'This field is required', 
          min: null, 
          max: null,
          integerOnly: false,
          divisibleBy: null
        },
        date: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a date',
          minDate: null,
          maxDate: null,
          disallowPast: false,
          disallowFuture: false
        },
        time: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a time',
          minTime: null,
          maxTime: null
        },
        
        // Advanced Types
        matrix: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please respond to all items',
          allRowsRequired: true,
          minPerRow: null,
          maxPerRow: null
        },
        ranking: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please rank all items',
          allItemsRanked: true,
          uniqueRanks: true
        },
        constant_sum: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please allocate the total correctly',
          exactTotal: true,
          tolerance: 0
        },
        max_diff: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select best and worst for each set',
          bothRequired: true
        },
        side_by_side: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please complete all columns',
          allColumnsRequired: true
        },
        card_sort: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please sort all cards',
          allCardsSorted: true,
          minPerCategory: null,
          maxPerCategory: null
        },
        
        // Media Types
        file_upload: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please upload at least one file',
          minFiles: 1,
          maxFiles: 5,
          fileTypes: [],
          maxFileSize: 10 // MB
        },
        image_choice: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select an image',
          minSelections: 1,
          maxSelections: 1
        },
        signature: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please provide your signature',
          minStrokes: 2
        },
        drawing: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please create a drawing',
          minStrokes: 1
        },
        video_response: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please record or upload a video',
          minDuration: 5, // seconds
          maxDuration: 300
        },
        audio_response: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please record or upload audio',
          minDuration: 3, // seconds
          maxDuration: 180
        },
        
        // Interactive Types
        heat_map: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please click on the image',
          minClicks: 1,
          maxClicks: null
        },
        hot_spot: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select at least one region',
          minRegions: 1,
          maxRegions: null
        },
        map_location: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please select a location',
          requireAddress: false,
          radiusRequired: false
        },
        priority_grid: {
          forceResponse: false,
          requestResponse: false,
          requiredError: 'Please place all items on the grid',
          allItemsPlaced: true,
          minPerQuadrant: null,
          maxPerQuadrant: null
        }
      }
      
      return defaults[type] || { 
        forceResponse: false,
        requestResponse: false,
        requiredError: 'This field is required' 
      }
    },
    
    
    // Remove a question
    removeQuestion(questionId) {
      this.$store.survey.removeQuestion(questionId)
      if (this.$store.ui.selectedQuestionId === questionId) {
        this.$store.ui.closeSettingsPanel()
      }
    },
    
    // Duplicate a question
    duplicateQuestion(questionId) {
      const newId = this.$store.survey.duplicateQuestion(questionId)
      if (newId) {
        this.$store.ui.selectQuestion(newId)
      }
    },
    
    // Change question type
    changeQuestionType(questionId, newType) {
      this.$store.survey.updateQuestion(questionId, {
        type: newType,
        settings: this.getDefaultSettings(newType),
        validation: this.getDefaultValidation(newType)
      })
      
      // Close dropdown
      this.showQuestionTypes = null
      
      // Track recently used
      this.trackRecentlyUsedType(newType)
      
      // Trigger auto-save
      this.$store.ui.debouncedAutoSave()
    },
    
    // Add option to question
    addOption(questionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question || !question.options) return
      
      const newOption = {
        id: `opt_${Date.now()}`,
        text: `Option ${question.options.length + 1}`
      }
      
      question.options.push(newOption)
      this.$store.ui.debouncedAutoSave()
    },
    
    // Remove option from question
    removeOption(questionId, optionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question || !question.options || question.options.length <= 2) return
      
      question.options = question.options.filter(opt => opt.id !== optionId)
      this.$store.ui.debouncedAutoSave()
    },
    
    // Question validation
    validateQuestionNumber(questionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question) return
      
      // Check for duplicates
      const duplicates = this.$store.survey.questions.filter(q => 
        q.id !== questionId && 
        q.questionNumber && 
        q.questionNumber.trim().toLowerCase() === question.questionNumber.trim().toLowerCase()
      )
      
      // Store validation result
      this.$store.ui.questionNumberValidation[questionId] = {
        isValid: duplicates.length === 0,
        duplicateWith: duplicates.length > 0 ? duplicates[0].id : null
      }
    },
    
    isQuestionNumberValid(questionId) {
      const validation = this.$store.ui.questionNumberValidation[questionId]
      return !validation || validation.isValid
    },
    
    // Comments
    toggleCommentThread(questionId) {
      this.$store.ui.toggleCommentSidebar(questionId)
    },
    
    getCommentCount(questionId) {
      return this.$store.comment.getCommentCount(questionId)
    },
    
    hasUnresolvedComments(questionId) {
      return this.$store.comment.hasUnresolvedComments(questionId)
    },
    
    // Question types management
    getQuestionTypeCategories() {
      return {
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
      }
    },
    
    // Track recently used question types
    trackRecentlyUsedType(type) {
      const recent = this.$store.ui.recentlyUsedTypes
      
      // Remove if already exists
      const index = recent.indexOf(type)
      if (index > -1) {
        recent.splice(index, 1)
      }
      
      // Add to beginning
      recent.unshift(type)
      
      // Keep only last 5
      if (recent.length > 5) {
        recent.pop()
      }
    },
    
    // Get recently used types with full data
    get recentlyUsedTypes() {
      const allTypes = Object.values(this.getQuestionTypeCategories()).flat()
      return this.$store.ui.recentlyUsedTypes
        .map(typeId => allTypes.find(t => t.id === typeId))
        .filter(Boolean)
        .slice(0, 3)
    },
    
    // Dropdown keyboard navigation
    handleDropdownKeydown(event, questionId) {
      // Implementation would handle arrow keys, enter, etc.
      if (event.key === 'Escape') {
        this.showQuestionTypes = null
      }
    },
    
    // Type highlighting
    setHighlightedType(typeKey) {
      this.highlightedType = typeKey
    },
    
    isTypeHighlighted(typeKey) {
      return this.highlightedType === typeKey
    },
    
    // Auto-save trigger
    debouncedAutosave() {
      this.$store.ui.debouncedAutoSave()
    }
  }
}