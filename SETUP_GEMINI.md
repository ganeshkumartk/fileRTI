# Quick Setup Guide - Gemini API Integration

## 🚀 Setup Steps

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment
Add to your `.env` file in your project root:

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here
```

**Note**: Your API key is already configured in your `.env` file!

### 3. Test the Integration
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your RTI Composer
3. Select the "Enhanced AI" tab (new Brain icon)
4. Fill in your query and select a department
5. Click "Generate Enhanced RTI Application"

## ✅ What's New

### Enhanced AI Mode
- **Location**: RTI Composer → "Enhanced AI" tab
- **Features**: 
  - Structured output with JSON schema
  - Advanced generation options (tone, priority)
  - AI reasoning process (optional)
  - Real-time compliance validation
  - Legal reference analysis

### Generation Options
- **Basic Settings**:
  - Application Tone: Formal, Urgent, Follow-up
  - Priority Level: Low, Medium, High
  - Enhanced Reasoning: Beta feature
  - Structured Output: Always enabled

- **Advanced Options**:
  - Additional Context: Custom context for better generation

### AI Analysis Panel
After generation, you'll see:
- **Content Structure**: Breakdown of information points
- **Legal Compliance**: RTI Act compliance statements
- **AI Reasoning**: Thought process (when enabled)

## 🔧 Troubleshooting

### Common Issues

1. **"Generation Failed" Error**
   - Check your API key in `.env` file
   - Verify internet connection
   - Check browser console for detailed errors

2. **"Unauthorized" Error**
   - Ensure you're logged in to the platform
   - Check if your session is valid

3. **Slow Generation**
   - Normal for first request (model loading)
   - Subsequent requests should be faster

### API Limits
- Free tier: 15 requests per minute
- Paid tier: Higher limits available
- Monitor usage in Google AI Studio

## 📊 Features Comparison

| Feature | Basic AI | Enhanced AI |
|---------|----------|-------------|
| Generation Speed | Fast | Medium |
| Output Quality | Good | Excellent |
| Structured Format | No | Yes |
| Legal Compliance | Basic | Advanced |
| Reasoning Process | No | Optional |
| Context Awareness | Limited | Enhanced |

## 🎯 Best Practices

### For Better Results
1. **Be Specific**: Provide detailed queries
2. **Add Context**: Use the advanced options for complex cases
3. **Choose Right Tone**: Match the urgency of your request
4. **Review Output**: Always check the generated content
5. **Use Reasoning**: Enable for complex legal scenarios

### Query Examples

**Good Query:**
```
I need information about the tender process for road construction projects in my district, including eligibility criteria, selection process, and awarded contracts in the last 2 years.
```

**Better Query with Context:**
```
Query: Information about road construction tenders
Context: I'm investigating potential irregularities in the tender process for NH-44 expansion project. Need transparency in contractor selection and fund allocation.
```

## 🔒 Security Notes

- API key is stored server-side only
- No sensitive data is logged
- Generated content is encrypted in database
- Compliance with data protection standards

## 📈 Analytics

The system tracks:
- Generation success rates
- Compliance scores
- User preferences
- Performance metrics

Access analytics through your admin dashboard (if available).

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review browser console errors
3. Verify API key configuration
4. Test with simple queries first
5. Contact support with error details

---

**Ready to use!** Your Enhanced AI RTI generation is now live and ready to create professional, compliant RTI applications with advanced AI assistance. 