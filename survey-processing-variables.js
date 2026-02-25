# PDF.co API Setup Guide

## Your API Key
```
cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR
```

## HTTP Request Configuration

### Method: POST
### URL: `https://api.pdf.co/v1/pdf/convert/from/html`

### Headers:
```json
{
  "x-api-key": "cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR",
  "Content-Type": "application/json"
}
```

### Body (JSON):
```json
{
  "html": "{{ report_html }}",
  "name": "Leadership-Feedback-Report-{{ survey.manager_name }}.pdf",
  "async": false,
  "margins": "20px",
  "paperSize": "A4",
  "orientation": "Portrait",
  "printBackground": true,
  "mediaType": "print"
}
```

### Expected Response:
```json
{
  "url": "https://pdf-temp-files.s3-us-west-2.amazonaws.com/...",
  "pageCount": 3,
  "error": false,
  "status": 200,
  "name": "Leadership-Feedback-Report.pdf",
  "remainingCredits": 9950
}
```

### Access PDF URL:
Use `{{ pdf_response.url }}` in your email template to provide the download link.

## Error Handling:
If PDF generation fails, the response will include:
```json
{
  "error": true,
  "message": "Error description"
}
```

## Usage Tips:
1. **HTML Quality**: Ensure your HTML is well-formed
2. **CSS Inline**: Use inline styles or `<style>` tags for best results
3. **File Size**: Keep HTML under 10MB for optimal processing
4. **Async**: Set to `false` for immediate processing, `true` for large files
5. **Credits**: Monitor your remaining credits in the response