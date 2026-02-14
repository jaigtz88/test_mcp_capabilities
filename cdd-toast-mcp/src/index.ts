import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import { z } from "zod";

// Load environment variables (with quiet mode to prevent stdout pollution)
dotenv.config({ quiet: true });

// Create the MCP server
const server = new McpServer({
  name: "Angular Toast Notification Configurator",
  version: '1.0.0',
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; // Your GitHub username
const GITHUB_REPO = process.env.GITHUB_REPO;   // Your repository name

// Helper function to make GitHub API requests
async function githubRequest(endpoint: string, options: any = {}) {
    const url = `https://api.github.com${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`GitHub API Error: ${error.message || response.statusText}`);
    }

    return response.json();
}

// Tool 1: Get repository information
async function getRepositoryInfo() {
    try {
        const data = await githubRequest(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}`);
        return {
            name: data.name,
            description: data.description,
            stars: data.stargazers_count,
            forks: data.forks_count,
            open_issues: data.open_issues_count,
            language: data.language,
            url: data.html_url,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Tool 2: List repository contents (browse directories)
async function listContents(path = '', branch = 'main') {
    try {
        // DEMO : Block access to cdd-toast-mcp directory
        if (path.startsWith('cdd-toast-mcp')) {
            return { error: 'Access to cdd-toast-mcp directory is restricted' };
        }
        
        const data = await githubRequest(
            `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${branch}`
        );
        
        // If it's an array, it's a directory listing
        if (Array.isArray(data)) {
            return data
                .filter(item => 
                    item.name !== 'cdd-toast' && 
                    !item.path.startsWith('cdd-toast')
                ) // Exclude cdd-toast folder and its contents
                .map(item => ({
                    name: item.name,
                    path: item.path,
                    type: item.type, // 'file' or 'dir'
                    size: item.size,
                    url: item.html_url,
                }));
        }
        
        // If it's a single file, return file info
        return {
            name: data.name,
            path: data.path,
            type: data.type,
            size: data.size,
            url: data.html_url,
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Tool 3: Get file contents
async function getFileContents(filePath: string, branch = 'main') {
    try {
        // DEMO : Block access to cdd-toast-mcp directory
        if (filePath.startsWith('cdd-toast-mcp')) {
            //return { error: 'Access to cdd-toast-mcp directory is restricted' };
        }
        
        const data = await githubRequest(
            `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${branch}`
        );
        
        // Decode base64 content
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        
        return {
            path: data.path,
            name: data.name,
            size: data.size,
            content: content,
            sha: data.sha,
            url: data.html_url,
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Tool 4: Configure Angular app with toast notifications
async function configureAngularApp(configPath = 'doc/configuration.md', branch = 'main') {
    try {
        // Get configuration documentation from repository
        const configDoc = await getFileContents(configPath, branch);
        
        if (configDoc.error) {
            return { 
                error: `Could not fetch configuration file: ${configDoc.error}`,
                success: false 
            };
        }
        
        // Parse the configuration documentation to extract configuration details
        const content = configDoc.content || '';
        
        // Extract ToastConfig interface
        const toastConfigMatch = content.match(/export interface ToastConfig \{([\s\S]*?)\}/);
        
        // Extract configuration options descriptions
        const positionMatch = content.match(/- \*\*`position`\*\*:(.*?)(?=\n\n- \*\*|$)/s);
        const durationMatch = content.match(/- \*\*`duration`\*\*:(.*?)(?=\n\n- \*\*|$)/s);
        const maxToastsMatch = content.match(/- \*\*`maxToasts`\*\*:(.*?)(?=\n\n- \*\*|$)/s);
        const progressBarMatch = content.match(/- \*\*`showProgressBar`\*\*:(.*?)(?=\n\n- \*\*|$)/s);
        const enableSoundMatch = content.match(/- \*\*`enableSound`\*\*:(.*?)(?=\n\n- \*\*|$)/s);
        
        // Extract HTTP loader factory example
        const httpLoaderMatch = content.match(/export const httpLoaderFactoryToast = \(httpClient: HttpClient\)([\s\S]*?)\};/);
        
        // Extract JSON config example
        const jsonConfigMatch = content.match(/```json\s*\{([\s\S]*?)\}\s*```/);
        
        return {
            success: true,
            configuration: {
                interface: toastConfigMatch ? toastConfigMatch[0] : null,
                descriptions: {
                    position: positionMatch ? positionMatch[1].trim() : null,
                    duration: durationMatch ? durationMatch[1].trim() : null,
                    maxToasts: maxToastsMatch ? maxToastsMatch[1].trim() : null,
                    showProgressBar: progressBarMatch ? progressBarMatch[1].trim() : null,
                    enableSound: enableSoundMatch ? enableSoundMatch[1].trim() : null,
                },
                implementation: {
                    httpLoader: httpLoaderMatch ? httpLoaderMatch[0] : null,
                    jsonConfig: jsonConfigMatch ? jsonConfigMatch[1].trim() : null
                }
            },
            instructions: [
                '1. Create toast-config.json in src/assets/config/',
                '2. Import ToastNotificationModule in app.config.ts',
                '3. Create httpLoaderFactoryToast function to load JSON config',
                '4. Add environment-specific overrides (production vs development)',
                '5. Register module with importProvidersFrom(ToastNotificationModule.forRootWithProvider(httpLoaderFactoryToast))',
                '6. Inject ToastService in components where needed'
            ],
            configurationTemplate: {
                position: "top-right",
                duration: 3000,
                maxToasts: 5,
                animationDuration: 300,
                showProgressBar: true,
                pauseOnHover: true,
                enableSound: false,
                defaultType: "info",
                allowedOrigins: ["https://api.myapp.com"]
            },
            usageExamples: {
                basic: "this.toastService.success('Operation completed!');",
                custom: "this.toastService.show({ title: 'Success', message: 'Done!', type: ToastType.Success });",
                withCallback: "this.http.post('/api/data', data).subscribe({ next: () => this.toastService.success('Saved!'), error: () => this.toastService.error('Failed!') });"
            },
            documentationUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${branch}/${configPath}`
        };
    } catch (error) {
        return { 
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false 
        };
    }
}

// Register tools with MCP server

// Tool 1: Get repository info (READ-ONLY)
server.tool(
    "cdd-get_repository_info",
    "Gets basic information about the Angular Toast Notifications demo repository including name, description, stars, and last update time.",
    {},
    async () => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await getRepositoryInfo(), null, 2),
                },
            ],
        };
    }
);

// Tool 2: List repository contents (READ-ONLY)
server.tool(
    "cdd-list_contents",
    "Lists files and directories in the Angular Toast Notifications demo repository from GitHub. Use this to browse the remote repository structure, documentation, sample components, and configuration files. Excludes internal MCP server folder (cdd-toast).",
    {
        path: z.string().optional().default('').describe("Path to directory or file to list"),
        branch: z.string().optional().default('main').describe("Git branch to browse"),
    },
    async ({ path, branch }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await listContents(path, branch), null, 2),
                },
            ],
        };
    }
);

// Tool 3: Get file contents (READ-ONLY)
server.tool(
    "cdd-get_file_contents",
    "Retrieves the complete contents of a specific file from the Angular Toast Notifications repository. Use this to read documentation, sample components, configuration examples, or type definitions.",
    {
        filePath: z.string().min(1).describe("Relative path to the file in the repository"),
        branch: z.string().optional().default('main').describe("Git branch to fetch from"),
    },
    async ({ filePath, branch }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await getFileContents(filePath, branch), null, 2),
                },
            ],
        };
    }
);

// Tool 4: Configure Angular app with toast notifications (ACTION)
server.tool(
    "cdd-configure_angular_app",
    "Fetches and analyzes toast notification configuration from the GitHub repository. Use this MCP tool when the user asks to: configure toast notifications, set up toasts, add toast library to Angular app, configure angular-toast-notifications, integrate toast service, or set up notification system. Returns complete configuration instructions, JSON templates, HTTP loader examples, and usage patterns extracted from the remote GitHub documentation.",
    {
        configPath: z.string().optional().default('doc/configuration.md').describe("Path to the configuration documentation file in the repository"),
        branch: z.string().optional().default('main').describe("Git branch to fetch the configuration from"),
    },
    async ({ configPath, branch }) => {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(await configureAngularApp(configPath, branch), null, 2),
                },
            ],
        };
    }
);

// Set up transport
async function init() {
    try {
        // Log environment variables status (without exposing sensitive data)
        console.error('Initializing MCP Server...');
        console.error('GitHub Owner:', GITHUB_OWNER || 'NOT SET');
        console.error('GitHub Repo:', GITHUB_REPO || 'NOT SET');
        console.error('GitHub Token:', GITHUB_TOKEN ? 'SET' : 'NOT SET');
        
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error('CDD-Toast MCP Server running on stdio');
    } catch (error) {
        console.error('Failed to initialize MCP Server:', error);
        process.exit(1);
    }
}

// Initialize the server
init().catch((error) => {
    console.error('Fatal error during initialization:', error);
    process.exit(1);
});
