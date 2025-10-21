---
applyTo: '**'
name: 'CipherWatch - AI Coding Agent Instructions'
mode: 'agent'
---

# CipherWatch - AI Coding Agent Instructions

## Project Overview
**Project Name:** CipherWatch  
**Purpose:** Fraud detection software for bank transactions  
**Architecture:** Simple SaaS web application with ML-powered backend  
**Primary Agents:** GitHub Copilot (VS Code), Gemini CLI

## Key Features
- User-friendly CLI-style GUI for transaction input
- Real-time fraud detection using machine learning
- Detailed transaction analysis and reporting
- Model performance metrics and insights

## Content Guidelines

### Writing Style

- Use clear, concise language
- Write in imperative mood ("Use", "Implement", "Avoid")
- Be specific and actionable
- Avoid ambiguous terms like "should", "might", "possibly"
- Use bullet points and lists for readability
- Keep sections focused and scannable

### Best Practices

- **Be Specific**: Provide concrete examples rather than abstract concepts
- **Show Why**: Explain the reasoning behind recommendations when it adds value
- **Use Tables**: For comparing options, listing rules, or showing patterns
- **Include Examples**: Real code snippets are more effective than descriptions
- **Stay Current**: Reference current versions and best practices
- **Link Resources**: Include official documentation and authoritative sources

### Common Patterns to Include

1. **Naming Conventions**: How to name variables, functions, classes, files
2. **Code Organization**: File structure, module organization, import order
3. **Error Handling**: Preferred error handling patterns
4. **Dependencies**: How to manage and document dependencies
5. **Comments and Documentation**: When and how to document code
6. **Version Information**: Target language/framework versions

---

## Technology Stack

### Frontend
- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling Framework:** Tailwind CSS (CDN-loaded)
- **Custom Styles:** `style.css` for project-specific overrides
- **Architecture:** Single-page application (SPA) or multi-page as needed

### Backend
- **Language:** Python 3.8+
- **Framework:** Flask (lightweight Python web framework)
- **ML Model:** Pre-trained fraud detection model (`.joblib` format)
- **API Pattern:** RESTful JSON endpoints
- **CORS:** flask-cors for frontend-backend communication

### Key Files
- `index.html` - Main application interface
- `script.js` - Frontend logic, API communication, DOM manipulation
- `style.css` - Custom CSS overrides and theme variables
- `app.py` (or `main.py`) - Python backend server
- `model.joblib` - Serialized ML model for fraud detection
- `requirements.txt` - Python dependencies

---

## Coding Standards & Guidelines

### General Principles
1. **Clarity over cleverness** - Write readable, maintainable code
2. **Modular architecture** - Break down complex functions into smaller, reusable units
3. **Error handling** - Always implement try-catch blocks and user-friendly error messages
4. **Security-first** - Sanitize inputs, validate data, use HTTPS in production
5. **Performance-conscious** - Optimize for speed; this is a real-time fraud detection system

### HTML Guidelines
- Use semantic HTML5 elements (`<main>`, `<section>`, `<article>`, `<nav>`)
- Include proper ARIA labels for accessibility
- Keep structure clean and well-indented (2 spaces)
- Load Tailwind CSS via CDN in `<head>`:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- Link `style.css` AFTER Tailwind for proper override cascade
- Use data attributes for JavaScript hooks: `data-action="submit-transaction"`

### CSS Guidelines (style.css)
- Use CSS custom properties for theme consistency:
  ```css
  :root {
    --primary-color: #your-brand-color;
    --danger-color: #ef4444;
    --success-color: #10b981;
  }
  ```
- Override Tailwind sparingly; prefer Tailwind utilities first
- Use BEM naming convention for custom classes: `.transaction-card__header`
- Mobile-first responsive design
- Comment complex selectors and layout decisions

### JavaScript Guidelines (script.js)
- **Code Style:**
  - Use `const` by default, `let` when reassignment needed, never `var`
  - Arrow functions for callbacks and short functions
  - Async/await for promises (cleaner than `.then()` chains)
  - 2-space indentation
  
- **Architecture:**
  - Organize code into logical sections with clear comments:
    ```javascript
    // ========================================
    // API Communication
    // ========================================
    
    // ========================================
    // UI State Management
    // ========================================
    
    // ========================================
    // Event Handlers
    // ========================================
    ```
  
- **API Communication:**
  - Use `fetch()` API for HTTP requests
  - Always handle loading states, errors, and success responses
  - Include proper headers:
    ```javascript
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData)
    });
    ```
  - Implement request timeout and retry logic for production readiness
  
- **Error Handling:**
  ```javascript
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    showUserFriendlyError('Unable to process transaction. Please try again.');
  }
  ```

- **DOM Manipulation:**
  - Cache DOM selections to avoid repeated queries
  - Use event delegation for dynamic elements
  - Sanitize user input before displaying (XSS prevention)

### Python Backend Guidelines (app.py)
- **Framework Choice:** Flask (lightweight and straightforward for ML model hosting)
  
- **Code Style:**
  - Follow PEP 8 conventions
  - Use type hints for function parameters and returns
  - 4-space indentation
  - Document functions with docstrings
  
- **Project Structure:**
  ```python
  # Import order: standard library → third-party → local
  import os
  from typing import Dict, Any
  
  from flask import Flask, request, jsonify
  from flask_cors import CORS
  import joblib
  import numpy as np
  ```

- **Model Loading:**
  ```python
  # Load model once at startup, not per request
  MODEL_PATH = 'model.joblib'
  model = None
  
  def load_model():
      global model
      try:
          model = joblib.load(MODEL_PATH)
          print(f"✓ Model loaded successfully from {MODEL_PATH}")
      except Exception as e:
          print(f"✗ Error loading model: {e}")
          raise
  ```

- **API Endpoints:**
  - Use RESTful conventions: `/api/predict`, `/api/transactions`, `/api/health`
  - Return consistent JSON structure:
    ```python
    {
      "success": true,
      "data": {...},
      "message": "Transaction analyzed successfully"
    }
    ```
  - Include proper HTTP status codes (200, 400, 500)
  - Enable CORS for local development: `CORS(app)`

- **Request Validation:**
  ```python
  @app.route('/api/predict', methods=['POST'])
  def predict_fraud():
      try:
          data = request.get_json()
          
          # Validate required fields
          required_fields = ['amount', 'merchant', 'timestamp']
          if not all(field in data for field in required_fields):
              return jsonify({
                  'success': False,
                  'message': 'Missing required fields'
              }), 400
          
          # Process with model
          prediction = model.predict([preprocess_input(data)])
          
          return jsonify({
              'success': True,
              'data': {
                  'is_fraud': bool(prediction[0]),
                  'confidence': float(prediction[1])
              }
          })
      except Exception as e:
          return jsonify({
              'success': False,
              'message': str(e)
          }), 500
  ```

- **Security:**
  - Validate and sanitize all inputs
  - Use environment variables for sensitive config (never hardcode)
  - Implement rate limiting for production
  - Add request logging for debugging and monitoring

---

## AI Agent Behavior Guidelines

### When Generating Code:
1. **Ask clarifying questions** if requirements are ambiguous
2. **Provide complete, working code** - no pseudocode or placeholders
3. **Include comments** explaining complex logic, especially ML preprocessing
4. **Follow the established patterns** in existing files
5. **Suggest improvements** to security, performance, or UX when relevant

### When Reviewing Code:
1. Check for security vulnerabilities (XSS, injection, CORS issues)
2. Verify error handling exists for all async operations
3. Ensure frontend-backend contract matches (request/response structure)
4. Validate that Tailwind classes are used correctly
5. Confirm model inference code handles edge cases

### When Answering Questions:
1. Provide context-aware answers specific to **CipherWatch**
2. Reference actual file names and code structure
3. Offer code examples using the project's tech stack
4. Suggest testing strategies for fraud detection accuracy
5. Consider production deployment implications

### When Suggesting Features:
1. Maintain the simple SaaS architecture (don't over-engineer)
2. Ensure new features integrate with existing fraud detection workflow
3. Prioritize user experience for bank transaction review
4. Consider real-time performance requirements
5. Suggest incremental improvements over major rewrites

---

## Project-Specific Context

### Fraud Detection Workflow
1. User inputs transaction details (amount, merchant, timestamp, etc.)
2. Frontend validates and sends data to Python backend via `script.js`
3. Backend preprocesses input to match model's expected format
4. Model predicts fraud probability
5. Backend returns prediction + confidence score
6. Frontend displays result with visual indicators (color-coded alerts)

### Key Features to Maintain
- Real-time fraud prediction (< 2 second response time)
- Clear visual feedback (red/green indicators for fraud/legitimate)
- Transaction history display (if implemented)
- Confidence score visualization
- User-friendly error messages

### Data Privacy & Compliance
- Never log sensitive transaction details in plain text
- Implement proper data retention policies
- Ensure GDPR/financial compliance in production
- Hash or anonymize stored transaction data

---

## Development Workflow

### Local Development Setup
```bash
# Backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py

# Frontend
# Simply open index.html in browser or use Live Server extension
```

### Testing Checklist
- [ ] Model loads without errors
- [ ] API endpoint returns expected JSON structure
- [ ] Frontend handles loading/error/success states
- [ ] UI is responsive on mobile and desktop
- [ ] Error messages are user-friendly
- [ ] CORS is configured correctly for API calls

### Deployment Considerations
- Use environment variables for configuration
- Implement proper logging (not just `console.log`)
- Add health check endpoint: `/api/health`
- Consider model versioning strategy
- Set up HTTPS and secure headers

---

## Common Tasks & Expected Behavior

### Task: "Add a new transaction input field"
**Agent should:**
- Update HTML with proper form structure and Tailwind classes
- Add validation logic in `script.js`
- Update API request payload structure
- Modify backend to accept new field
- Update model preprocessing if needed

### Task: "Improve error handling"
**Agent should:**
- Add try-catch blocks in both frontend and backend
- Implement user-friendly error messages
- Add console logging for debugging
- Consider retry logic for network failures
- Return proper HTTP status codes

### Task: "Optimize model prediction speed"
**Agent should:**
- Review preprocessing pipeline for bottlenecks
- Suggest model quantization or optimization techniques
- Implement caching strategies if appropriate
- Profile Python code for performance issues
- Consider async processing for large batches

---

## File Modification Protocols

### Before Modifying Existing Code:
1. Read and understand the current implementation
2. Identify dependencies and side effects
3. Maintain existing code style and patterns
4. Add comments explaining changes
5. Suggest running tests after changes

### When Creating New Files:
1. Follow the established naming conventions
2. Add appropriate file headers/comments
3. Include necessary imports and dependencies
4. Ensure new code integrates with existing architecture
5. Update this instruction file if new patterns are introduced

---

## Context Awareness

**You are working on CipherWatch**, a fraud detection SaaS application. Always consider:
- The end user is a bank employee reviewing transactions
- Real-time performance is critical
- Security and data privacy are paramount
- The system must be reliable and trustworthy
- Simple, clean UI reduces review time and errors

When in doubt, **ask the developer** rather than making assumptions that could compromise security or functionality.

---

## Additional Developer Instructions

This section is reserved for **project-specific requirements** that you'll provide to the coding agents. When you add custom instructions below, the AI will follow them alongside the guidelines above.

### Custom Requirements
<!-- Add your specific requirements here as you develop the project -->
<!-- Example format:
- **Feature X:** Description of how it should work
- **UI Requirement:** Specific styling or layout needs
- **Data Handling:** Particular preprocessing or validation rules
- **Model Input Format:** Exact feature names and expected data types
-->

**Instructions will be added here as the project evolves.**

---

## Version & Maintenance
**Last Updated:** [Current Date]  
**Project Status:** In Active Development  
**Review Frequency:** Update this file when major architectural changes occur

---

*These instructions ensure consistent, high-quality code generation across GitHub Copilot and Gemini CLI for the CipherWatch project.*```