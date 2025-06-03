
# JSON Diff Analysis Scripts

This directory contains TypeScript scripts for automatically analyzing changes in JSON files that contain escaped JSON strings, specifically designed for GitHub Actions workflows.

## Overview

The system is designed to handle JSON arrays where each item has a `Value` field containing escaped JSON:

```json
[
  {
    "Category": "Pokemon",
    "Name": "Cartoon",
    "Value": "{\"foo\":5375,\"bar\":80401,\"bike\":\"HLN*^tx5p*\"}"
  }
]
```

## How It Works

1. **Detection**: GitHub Action triggers on JSON file changes in PRs
2. **Parsing**: Scripts parse the main JSON and unescape inner JSON objects
3. **Comparison**: Deep comparison between before/after versions
4. **URL Generation**: Creates comparison tool URLs with base64-encoded data
5. **PR Comments**: Posts analysis results as PR comments with clickable links

## Files

- `analyze-json-changes.ts`: Main analysis script
- `package.json`: Dependencies for TypeScript execution
- `README.md`: This documentation

## Configuration

### 1. Update GitHub Action Workflow

Edit `.github/workflows/json-diff-analysis.yml`:

```yaml
env:
  COMPARISON_TOOL_URL: 'https://your-actual-tool-url.com'  # Replace with your tool URL

on:
  pull_request:
    paths:
      - 'path/to/your/json/files/**/*.json'  # Adjust to your JSON file locations
```

### 2. File Path Patterns

The workflow currently monitors all `*.json` files. Update the `paths` section to be more specific:

```yaml
paths:
  - 'data/**/*.json'      # For data directory
  - 'config/data.json'    # For specific files
  - '**/pokemon-data.json' # For specific filenames anywhere
```

## Manual Usage

You can also run the analysis script manually:

```bash
# Install dependencies
cd scripts
npm install

# Run analysis
ts-node analyze-json-changes.ts before.json after.json https://your-tool.com output.md
```

### Parameters:
- `before.json`: Path to the previous version
- `after.json`: Path to the current version  
- `https://your-tool.com`: Base URL of your comparison tool
- `output.md`: Output file for the markdown comment

## Output Format

The script generates:

1. **PR Comments** with:
   - Summary of changes found
   - Individual diff links for each changed item
   - Categorization by change type (added/removed/modified)

2. **Comparison URLs** like:
   ```
   https://your-tool.com?before=<base64>&after=<base64>#/json-compare
   ```

## Example PR Comment

```markdown
## 🔍 JSON Comparison Analysis

Found **2** change(s) in your JSON data:

### Diff 1: Pokemon - Cartoon
**Type:** Modified
**Status:** Item modified
[📊 View Detailed Comparison](https://your-tool.com?before=eyJ...&after=eyJ...#/json-compare)

### Diff 2: Pokemon - TvShow  
**Type:** Added
**Status:** New item added
[📊 View Detailed Comparison](https://your-tool.com?before=e30=&after=eyJ...#/json-compare)
```

## Error Handling

The script handles:
- Malformed JSON gracefully
- Missing files (treats as empty arrays)
- Encoding/decoding errors
- Large datasets (no specific limits, but URLs have practical limits)

## Customization

### Change Detection Logic

Modify the `findChanges()` function to adjust what constitutes a "change":

```typescript
// Current: Uses JSON.stringify comparison
if (JSON.stringify(beforeItem.value) !== JSON.stringify(afterItem.value)) {
  // Detected as change
}

// Alternative: Could use deep object comparison library
// Alternative: Could ignore certain fields
// Alternative: Could use fuzzy matching
```

### URL Generation

Update `generateComparisonUrl()` to match your tool's URL structure:

```typescript
function generateComparisonUrl(beforeJson: any, afterJson: any, baseUrl: string): string {
  // Current format: ?before=<base64>&after=<base64>#/json-compare
  // Modify as needed for your tool
}
```

## Troubleshooting

### Common Issues:

1. **"No changes detected" but you see changes**
   - Check that JSON parsing succeeds for both versions
   - Verify the Category/Name combination creates unique keys
   - Check for whitespace/formatting differences

2. **URLs too long**
   - Base64 encoding can create very long URLs
   - Consider implementing a backend service to store large payloads

3. **GitHub Action fails**
   - Check file paths in workflow configuration
   - Ensure TypeScript dependencies install correctly
   - Verify GitHub token permissions

4. **Comparison tool doesn't load data**
   - Test URL generation manually
   - Check base64 encoding/decoding
   - Verify tool supports the URL parameter format

## Security Notes

- The scripts only process JSON data committed to the repository
- Base64 encoding is used for URL parameters (not encryption)
- GitHub token permissions are limited to read content and write PR comments
- No external services are called except your comparison tool
