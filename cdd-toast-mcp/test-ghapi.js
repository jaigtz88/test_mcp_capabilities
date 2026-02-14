// Quick test to verify GitHub API credentials
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

console.log('Testing GitHub API connection...');
console.log('Owner:', GITHUB_OWNER);
console.log('Repo:', GITHUB_REPO);
console.log('Token:', GITHUB_TOKEN ? '***SET***' : 'NOT SET');

async function test() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github+json',
            },
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('GitHub API Error:', error.message);
            process.exit(1);
        }
        
        const data = await response.json();
        console.log('✅ GitHub API connection successful!');
        console.log('Repository:', data.full_name);
        console.log('Description:', data.description ||'(no description)');
        console.log('Default branch:', data.default_branch);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

test();
