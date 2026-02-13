# CDD-Toast MCP Server - Custom Instructions

## 🎯 Project Overview

**Project Name:** CDD-Toast MCP Server (Configuration Detection & Deployment)

**Purpose:** An MCP (Model Context Protocol) server that helps internal users of our Angular library to configure, validate, and setup the library correctly using GitHub Copilot agents in VS Code.

**Problem Solved:**
- Users get stuck with manual library configuration
- Documentation in Confluence Wiki becomes outdated
- Configuration mistakes are common due to complexity

**Solution:**
- MCP server with direct access to our library repository
- Real-time documentation and example projects
- AI-powered assistance for automatic setup and validation
- Read-only, need-to-know access to documentation and examples

---

## 📋 Target Audience

**Internal Users Only:** Employees in our company using our Angular library via GitHub Copilot

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Testing Framework:** Vitest
- **Development:** Local initially, then deploy to company registry
- **Data Source:** Azure DevOps (internal repo)

---

## 🔧 Core Features & Tools

The MCP server exposes three main tools to the AI agent:

1. **`verifyConfig()`**
   - Validates user's library configuration
   - Checks against example configs
   - Returns validation report

2. **`setupConfig()`**
   - Auto-applies required configurations
   - Updates configuration files
   - Handles necessary setup steps

3. **`getDocs()`**
   - Retrieves up-to-date documentation
   - Pulls from `/doc` folder
   - Provides example from sample-app

---

## 📁 Project Structure

```
test_mcp_capabilities/
├── cdd-toast-mcp/             # MCP Server (core deliverable)
│   ├── src/
│   │   ├── tools/            # Tool implementations (verify, setup, docs)
│   │   ├── config/           # Config handlers
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Server entry point
│   ├── tests/                # Vitest test suite
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── projects/
│   └── sample-app/           # Example Angular app (reference project)
│       ├── src/
│       ├── assets/
│       │   └── config/
│       │       └── toast-config.json  # Example config for reference
│       └── package.json
├── doc/                       # Shared documentation (MCP server reads this)
│   ├── configuration.md
│   ├── usage-examples.md
│   └── README.md
└── README.md

**Keep cdd-toast-mcp at root because:**
- It's the primary deliverable/product
- Cleaner relative paths: `../doc`, `../projects/sample-app`
- Reflects it as infrastructure, not just an example
```

---

## 🔐 Security & Access Control

**Authentication:**
- Internal users only (no external authentication needed initially)

**Access Control Strategy:**
- Read-only access to `/doc` folder (documentation)
- Read-only access to `/projects/sample-app` (example configurations)
- Tool implementations validate and restrict data exposure
- No access to sensitive company data outside these folders

**Implementation:**
- Path validation in all file read operations
- Whitelist allowed directories
- Audit logging for accessed resources

---

## 📚 Development Guidelines

### Code Organization

- **Tools:** Each tool (verify, setup, docs) in `/src/tools/`
- **Config Handling:** Centralized in `/src/config/`
- **Utilities:** Shared functions in `/src/utils/`
- **Tests:** Mirror source structure in `/tests/`

### Naming Conventions

- Files: `kebab-case` (e.g., `verify-config.ts`)
- Functions/Classes: `camelCase` (e.g., `verifyConfig()`)
- Constants: `UPPER_SNAKE_CASE`

### Modularity & Extensibility

- Build tools as independent modules
- Each tool should be independently testable
- Create factory functions for easy tool registration
- Document tool parameters and return types clearly

---

## 🧪 Testing Requirements

- **Framework:** Vitest
- **Coverage Target:** 80%+
- **Test Structure:** Unit tests for each tool and utility
- **Integration Tests:** Test MCP server communication
- **Test Data:** Use examples from `/projects/sample-app`

---

## 📖 README Requirements

The main README must include:

### For Developers:
- Project setup instructions
- How to run locally
- How to run tests
- How to add new tools
- Development workflow

### For Users:
- What this MCP server does
- How to use it with GitHub Copilot
- Available tools and their capabilities
- Configuration examples
- Troubleshooting guide

---

## 🚀 Deployment

- **Initial:** Local development only
- **Production:** To company registry
- **Version Management:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Documentation:** Keep updated with each release

---

## 📝 Key Principles

1. **User-Centric:** Solve actual configuration problems
2. **Safe:** Read-only by default, validate all inputs
3. **Maintainable:** Clear structure for future expansion
4. **Documented:** Code comments, README, and examples
5. **Tested:** Comprehensive test coverage
6. **Secure:** Restricted access to intended resources only

---

## 🔗 Useful Commands

Once repository is set up:
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build
```

---

**Last Updated:** February 13, 2026
**Maintained By:** [Your Team/Department]
