# CDD-Toast MCP Server

An MCP (Model Context Protocol) server for analyzing, validating, and generating Angular toast notification configurations.

## Features

This MCP server provides tools to:

- **Analyze Configuration** - Read and understand toast configuration patterns from Angular applications
- **Validate Setup** - Check if toast configuration follows documented structure
- **Generate Code** - Create toast service usage based on existing patterns
- **Verify Documentation** - Ensure code implementation matches documentation

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Development

```bash
npm run watch  # Watch mode for development
npm run dev    # Build and run
```

## Usage

### Running the Server

```bash
npm start
```

### Integration with Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "cdd-toast": {
      "command": "node",
      "args": [
        "c:\\Users\\aznanmoh\\Documents\\Work\\Learning\\MCP\\test_mcp_capabilities\\cdd-toast\\dist\\index.js"
      ]
    }
  }
}
```

## Available Tools

### 1. `analyze_toast_config`
Analyzes toast configuration in an Angular application.

**Input:**
- `projectPath` - Path to the Angular project

**Returns:**
- Configuration structure found
- Environment-specific overrides
- JSON configuration details

### 2. `validate_toast_usage`
Validates toast service usage against documented patterns.

**Input:**
- `filePath` - Path to component file
- `code` - Code snippet to validate

**Returns:**
- Validation status
- Issues found
- Suggestions for fixes

### 3. `generate_toast_code`
Generates toast notification code based on patterns.

**Input:**
- `type` - Toast type (success, error, warning, info)
- `pattern` - Usage pattern (basic, custom, http-callback)

**Returns:**
- Generated code snippet
- Usage instructions

### 4. `verify_documentation`
Verifies code implementation matches documentation.

**Input:**
- `projectPath` - Path to the project

**Returns:**
- Sync status
- Discrepancies found
- Recommendations

## Project Structure

```
cdd-toast/
├── src/
│   ├── index.ts          # Main MCP server entry point
│   ├── tools/            # MCP tool implementations
│   └── utils/            # Helper functions
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## Development Notes

This server is designed to work with the dummy toast notification implementation in the parent `test_mcp_capabilities` project. It demonstrates how MCP servers can assist with:

- Code pattern analysis
- Configuration validation
- Code generation
- Documentation maintenance

## License

MIT
