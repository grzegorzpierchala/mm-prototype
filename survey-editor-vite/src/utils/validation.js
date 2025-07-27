// Validation framework for all question types
export class ValidationEngine {
  constructor() {
    this.validators = {
      // Essential Types
      text_input: this.validateTextInput,
      long_text: this.validateLongText,
      multiple_choice: this.validateMultipleChoice,
      checkbox: this.validateCheckbox,
      dropdown: this.validateDropdown,
      yes_no: this.validateYesNo,
      
      // Rating Types
      star_rating: this.validateStarRating,
      number_scale: this.validateNumberScale,
      nps: this.validateNPS,
      likert: this.validateLikert,
      slider: this.validateSlider,
      emoji_scale: this.validateEmojiScale,
      
      // Input Types
      number: this.validateNumber,
      email: this.validateEmail,
      phone: this.validatePhone,
      url: this.validateURL,
      date: this.validateDate,
      time: this.validateTime,
      
      // Advanced Types
      matrix: this.validateMatrix,
      ranking: this.validateRanking,
      constant_sum: this.validateConstantSum,
      max_diff: this.validateMaxDiff,
      side_by_side: this.validateSideBySide,
      card_sort: this.validateCardSort,
      
      // Media Types
      file_upload: this.validateFileUpload,
      image_choice: this.validateImageChoice,
      signature: this.validateSignature,
      drawing: this.validateDrawing,
      video_response: this.validateVideoResponse,
      audio_response: this.validateAudioResponse,
      
      // Interactive Types
      heat_map: this.validateHeatMap,
      hot_spot: this.validateHotSpot,
      map_location: this.validateMapLocation,
      priority_grid: this.validatePriorityGrid
    }
  }
  
  // Main validation method
  validate(question, response) {
    const validator = this.validators[question.type]
    if (!validator) {
      console.warn(`No validator found for question type: ${question.type}`)
      return { isValid: true, errors: [] }
    }
    
    return validator.call(this, question, response)
  }
  
  // Common validation helpers
  checkRequired(question, response, fieldName = 'This field') {
    if (question.validation?.forceResponse || question.required) {
      if (!response || (typeof response === 'string' && !response.trim())) {
        return {
          isValid: false,
          errors: [question.validation?.requiredError || `${fieldName} is required`]
        }
      }
    }
    return { isValid: true, errors: [] }
  }
  
  // Essential Type Validators
  validateTextInput(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && typeof response === 'string') {
      // Min length
      if (validation.minLength && response.length < validation.minLength) {
        errors.push(`Minimum ${validation.minLength} characters required`)
      }
      
      // Max length
      if (validation.maxLength && response.length > validation.maxLength) {
        errors.push(`Maximum ${validation.maxLength} characters allowed`)
      }
      
      // Pattern matching
      if (validation.pattern && !new RegExp(validation.pattern).test(response)) {
        errors.push(validation.patternError || 'Invalid format')
      }
      
      // Custom rules
      if (validation.customRules) {
        validation.customRules.forEach(rule => {
          if (!rule.test(response)) {
            errors.push(rule.error)
          }
        })
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateLongText(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && typeof response === 'string') {
      // Min/Max length
      if (validation.minLength && response.length < validation.minLength) {
        errors.push(`Minimum ${validation.minLength} characters required`)
      }
      if (validation.maxLength && response.length > validation.maxLength) {
        errors.push(`Maximum ${validation.maxLength} characters allowed`)
      }
      
      // Word count
      const wordCount = response.trim().split(/\s+/).length
      if (validation.minWords && wordCount < validation.minWords) {
        errors.push(`Minimum ${validation.minWords} words required`)
      }
      if (validation.maxWords && wordCount > validation.maxWords) {
        errors.push(`Maximum ${validation.maxWords} words allowed`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateMultipleChoice(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response, 'Please select an option')
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response) {
      const selections = Array.isArray(response) ? response : [response]
      
      // Min/Max selections
      if (validation.minSelections && selections.length < validation.minSelections) {
        errors.push(`Select at least ${validation.minSelections} option(s)`)
      }
      if (validation.maxSelections && selections.length > validation.maxSelections) {
        errors.push(`Select at most ${validation.maxSelections} option(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateCheckbox(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    if (validation.forceResponse || question.required) {
      if (!response || !Array.isArray(response) || response.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select at least one option']
        }
      }
    }
    
    if (response && Array.isArray(response)) {
      // Min/Max selections
      if (validation.minSelections && response.length < validation.minSelections) {
        errors.push(`Select at least ${validation.minSelections} option(s)`)
      }
      if (validation.maxSelections && response.length > validation.maxSelections) {
        errors.push(`Select at most ${validation.maxSelections} option(s)`)
      }
      if (validation.exactSelections && response.length !== validation.exactSelections) {
        errors.push(`Select exactly ${validation.exactSelections} option(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateDropdown(question, response) {
    return this.checkRequired(question, response, 'Please select an option')
  }
  
  validateYesNo(question, response) {
    return this.checkRequired(question, response, 'Please select an answer')
  }
  
  // Rating Type Validators
  validateStarRating(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response, 'Please provide a rating')
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && validation.minRating && response < validation.minRating) {
      errors.push(`Minimum rating of ${validation.minRating} required`)
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateNumberScale(question, response) {
    return this.checkRequired(question, response, 'Please select a number')
  }
  
  validateNPS(question, response) {
    return this.checkRequired(question, response, 'Please select a score')
  }
  
  validateLikert(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select a response for all items']
        }
      }
      
      if (validation.allItemsRequired) {
        const statements = question.settings?.statements || []
        const missingResponses = statements.filter(stmt => !response[stmt.id])
        if (missingResponses.length > 0) {
          errors.push('Please respond to all items')
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateSlider(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please move the slider to provide a response']
        }
      }
      
      if (validation.allSlidersRequired && question.settings?.statements?.length > 0) {
        const statements = question.settings.statements
        const responses = Array.isArray(response) ? response : [response]
        if (responses.length < statements.length) {
          errors.push('Please provide a response for all sliders')
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateEmojiScale(question, response) {
    return this.checkRequired(question, response, 'Please select an emoji')
  }
  
  // Input Type Validators
  validateEmail(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && typeof response === 'string') {
      // Email pattern - ensure it's a RegExp object
      let emailPattern = validation.pattern || /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      // Convert string pattern to RegExp if needed
      if (typeof emailPattern === 'string') {
        try {
          emailPattern = new RegExp(emailPattern)
        } catch (e) {
          // Fallback to default pattern if conversion fails
          emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
      }
      
      if (!emailPattern.test(response)) {
        errors.push(validation.patternError || 'Please enter a valid email address')
      }
      
      // Domain validation
      if (validation.domainWhitelist?.length > 0) {
        const domain = response.split('@')[1]
        if (!validation.domainWhitelist.includes(domain)) {
          errors.push('Email domain not allowed')
        }
      }
      
      if (validation.domainBlacklist?.length > 0) {
        const domain = response.split('@')[1]
        if (validation.domainBlacklist.includes(domain)) {
          errors.push('Email domain not allowed')
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validatePhone(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && typeof response === 'string') {
      // Phone pattern
      if (validation.pattern && !new RegExp(validation.pattern).test(response)) {
        errors.push(validation.patternError || 'Please enter a valid phone number')
      }
      
      // Country validation
      if (validation.countryValidation && question.settings?.internationalFormat) {
        // Basic international format check
        if (!response.startsWith('+')) {
          errors.push('Please include country code')
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateURL(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && typeof response === 'string') {
      // URL pattern
      const urlPattern = validation.pattern || /^https?:\/\//
      if (!urlPattern.test(response)) {
        errors.push(validation.patternError || 'Please enter a valid URL')
      }
      
      // Domain validation
      try {
        const url = new URL(response)
        const domain = url.hostname
        
        if (validation.domainWhitelist?.length > 0 && !validation.domainWhitelist.includes(domain)) {
          errors.push('URL domain not allowed')
        }
        
        if (validation.domainBlacklist?.length > 0 && validation.domainBlacklist.includes(domain)) {
          errors.push('URL domain not allowed')
        }
      } catch (e) {
        errors.push('Invalid URL format')
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateNumber(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response)
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response !== null && response !== undefined && response !== '') {
      const num = parseFloat(response)
      
      if (isNaN(num)) {
        errors.push('Please enter a valid number')
      } else {
        // Min/Max
        if (validation.min !== null && num < validation.min) {
          errors.push(`Minimum value is ${validation.min}`)
        }
        if (validation.max !== null && num > validation.max) {
          errors.push(`Maximum value is ${validation.max}`)
        }
        
        // Integer only
        if (validation.integerOnly && !Number.isInteger(num)) {
          errors.push('Please enter a whole number')
        }
        
        // Divisible by
        if (validation.divisibleBy && num % validation.divisibleBy !== 0) {
          errors.push(`Number must be divisible by ${validation.divisibleBy}`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateDate(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response, 'Please select a date')
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response) {
      const date = new Date(response)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Min/Max date
      if (validation.minDate && date < new Date(validation.minDate)) {
        errors.push(`Date must be after ${validation.minDate}`)
      }
      if (validation.maxDate && date > new Date(validation.maxDate)) {
        errors.push(`Date must be before ${validation.maxDate}`)
      }
      
      // Past/Future restrictions
      if (validation.disallowPast && date < today) {
        errors.push('Past dates are not allowed')
      }
      if (validation.disallowFuture && date > today) {
        errors.push('Future dates are not allowed')
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateTime(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    // Check required
    const requiredCheck = this.checkRequired(question, response, 'Please select a time')
    if (!requiredCheck.isValid) return requiredCheck
    
    if (response && (validation.minTime || validation.maxTime)) {
      // Convert time string to minutes for comparison
      const [hours, minutes] = response.split(':').map(Number)
      const timeInMinutes = hours * 60 + minutes
      
      if (validation.minTime) {
        const [minHours, minMinutes] = validation.minTime.split(':').map(Number)
        const minInMinutes = minHours * 60 + minMinutes
        if (timeInMinutes < minInMinutes) {
          errors.push(`Time must be after ${validation.minTime}`)
        }
      }
      
      if (validation.maxTime) {
        const [maxHours, maxMinutes] = validation.maxTime.split(':').map(Number)
        const maxInMinutes = maxHours * 60 + maxMinutes
        if (timeInMinutes > maxInMinutes) {
          errors.push(`Time must be before ${validation.maxTime}`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  // Advanced Type Validators
  validateMatrix(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please respond to all items']
        }
      }
      
      if (validation.allRowsRequired) {
        const statements = question.settings?.statements || []
        const missingResponses = statements.filter(stmt => !response[stmt.id])
        if (missingResponses.length > 0) {
          errors.push(`Please respond to all ${statements.length} items`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateRanking(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !Array.isArray(response)) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please rank all items']
        }
      }
      
      const items = question.options || []
      if (validation.allItemsRanked && response.length < items.length) {
        errors.push('Please rank all items')
      }
      
      if (validation.uniqueRanks) {
        const ranks = response.map(r => r.rank)
        const uniqueRanks = new Set(ranks)
        if (uniqueRanks.size !== ranks.length) {
          errors.push('Each item must have a unique rank')
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateConstantSum(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please allocate the total correctly']
        }
      }
      
      const total = Object.values(response).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
      const expectedTotal = question.settings?.total || 100
      
      if (validation.exactTotal) {
        const tolerance = validation.tolerance || 0
        if (Math.abs(total - expectedTotal) > tolerance) {
          errors.push(`Total must equal ${expectedTotal} (currently ${total})`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateMaxDiff(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select best and worst for each set']
        }
      }
      
      if (validation.bothRequired) {
        const sets = question.settings?.sets || []
        for (const set of sets) {
          if (!response[set.id]?.best || !response[set.id]?.worst) {
            errors.push('Please select both best and worst for all sets')
            break
          }
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateSideBySide(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please complete all columns']
        }
      }
      
      if (validation.allColumnsRequired) {
        const columns = question.settings?.columns || []
        const rows = question.options || []
        
        for (const row of rows) {
          for (const col of columns) {
            if (!response[row.id]?.[col.id]) {
              errors.push('Please complete all fields')
              return { isValid: false, errors }
            }
          }
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateCardSort(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please sort all cards']
        }
      }
      
      const cards = question.options || []
      const sortedCards = Object.values(response).flat()
      
      if (validation.allCardsSorted && sortedCards.length < cards.length) {
        errors.push('Please sort all cards into categories')
      }
      
      // Check min/max per category
      for (const [category, cardIds] of Object.entries(response)) {
        if (validation.minPerCategory && cardIds.length < validation.minPerCategory) {
          errors.push(`Each category must have at least ${validation.minPerCategory} cards`)
        }
        if (validation.maxPerCategory && cardIds.length > validation.maxPerCategory) {
          errors.push(`Each category can have at most ${validation.maxPerCategory} cards`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  // Media Type Validators
  validateFileUpload(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !Array.isArray(response) || response.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please upload at least one file']
        }
      }
      
      // Min/Max files
      if (validation.minFiles && response.length < validation.minFiles) {
        errors.push(`Upload at least ${validation.minFiles} file(s)`)
      }
      if (validation.maxFiles && response.length > validation.maxFiles) {
        errors.push(`Upload at most ${validation.maxFiles} file(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateImageChoice(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || (Array.isArray(response) && response.length === 0)) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select an image']
        }
      }
      
      const selections = Array.isArray(response) ? response : [response]
      
      // Min/Max selections
      if (validation.minSelections && selections.length < validation.minSelections) {
        errors.push(`Select at least ${validation.minSelections} image(s)`)
      }
      if (validation.maxSelections && selections.length > validation.maxSelections) {
        errors.push(`Select at most ${validation.maxSelections} image(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateSignature(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !response.strokes || response.strokes.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please provide your signature']
        }
      }
      
      if (validation.minStrokes && response.strokes.length < validation.minStrokes) {
        errors.push(`Signature too simple, please add more strokes`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateDrawing(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !response.strokes || response.strokes.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please create a drawing']
        }
      }
      
      if (validation.minStrokes && response.strokes.length < validation.minStrokes) {
        errors.push(`Please add more to your drawing`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateVideoResponse(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !response.url) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please record or upload a video']
        }
      }
      
      if (response.duration) {
        if (validation.minDuration && response.duration < validation.minDuration) {
          errors.push(`Video must be at least ${validation.minDuration} seconds`)
        }
        if (validation.maxDuration && response.duration > validation.maxDuration) {
          errors.push(`Video must be no more than ${validation.maxDuration} seconds`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateAudioResponse(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !response.url) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please record or upload audio']
        }
      }
      
      if (response.duration) {
        if (validation.minDuration && response.duration < validation.minDuration) {
          errors.push(`Audio must be at least ${validation.minDuration} seconds`)
        }
        if (validation.maxDuration && response.duration > validation.maxDuration) {
          errors.push(`Audio must be no more than ${validation.maxDuration} seconds`)
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  // Interactive Type Validators
  validateHeatMap(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !Array.isArray(response) || response.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please click on the image']
        }
      }
      
      if (validation.minClicks && response.length < validation.minClicks) {
        errors.push(`Click at least ${validation.minClicks} time(s)`)
      }
      if (validation.maxClicks && response.length > validation.maxClicks) {
        errors.push(`Click at most ${validation.maxClicks} time(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateHotSpot(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !Array.isArray(response) || response.length === 0) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select at least one region']
        }
      }
      
      if (validation.minRegions && response.length < validation.minRegions) {
        errors.push(`Select at least ${validation.minRegions} region(s)`)
      }
      if (validation.maxRegions && response.length > validation.maxRegions) {
        errors.push(`Select at most ${validation.maxRegions} region(s)`)
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validateMapLocation(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || !response.location) {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please select a location']
        }
      }
      
      if (validation.requireAddress && !response.address) {
        errors.push('Please provide an address for the location')
      }
      
      if (validation.radiusRequired && !response.radius) {
        errors.push('Please specify a radius')
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  validatePriorityGrid(question, response) {
    const errors = []
    const validation = question.validation || {}
    
    if (validation.forceResponse || question.required) {
      if (!response || typeof response !== 'object') {
        return {
          isValid: false,
          errors: [validation.requiredError || 'Please place all items on the grid']
        }
      }
      
      const items = question.options || []
      const placedItems = Object.keys(response)
      
      if (validation.allItemsPlaced && placedItems.length < items.length) {
        errors.push('Please place all items on the grid')
      }
      
      // Check quadrant limits
      if (validation.minPerQuadrant || validation.maxPerQuadrant) {
        const quadrants = { q1: 0, q2: 0, q3: 0, q4: 0 }
        for (const [itemId, position] of Object.entries(response)) {
          const quadrant = this.getQuadrant(position.x, position.y)
          quadrants[quadrant]++
        }
        
        for (const [quad, count] of Object.entries(quadrants)) {
          if (validation.minPerQuadrant && count < validation.minPerQuadrant) {
            errors.push(`Place at least ${validation.minPerQuadrant} items in each quadrant`)
            break
          }
          if (validation.maxPerQuadrant && count > validation.maxPerQuadrant) {
            errors.push(`Place at most ${validation.maxPerQuadrant} items in each quadrant`)
            break
          }
        }
      }
    }
    
    return { isValid: errors.length === 0, errors }
  }
  
  // Helper method for priority grid
  getQuadrant(x, y) {
    if (x >= 50 && y >= 50) return 'q1' // Top right
    if (x < 50 && y >= 50) return 'q2'  // Top left
    if (x < 50 && y < 50) return 'q3'   // Bottom left
    return 'q4' // Bottom right
  }
}

// Export singleton instance
export const validationEngine = new ValidationEngine()

// Real-time validation helper
export function validateField(question, response) {
  return validationEngine.validate(question, response)
}

// Form validation helper
export function validateSurvey(questions, responses) {
  const results = {}
  let isValid = true
  
  for (const question of questions) {
    const response = responses[question.id]
    const validation = validationEngine.validate(question, response)
    results[question.id] = validation
    
    if (!validation.isValid) {
      isValid = false
    }
  }
  
  return { isValid, results }
}