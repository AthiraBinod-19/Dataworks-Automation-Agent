const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

// Path where the repository will be cloned to
const cloneDirectory = '/data/clone-repo';  // You can change this to your preferred path

// Git repository URL (replace with the actual repository URL you want to clone)
const repoUrl = 'https://github.com/your-username/your-repo.git';  // Replace with your repository URL

// File to modify and commit (replace this with the actual file you want to modify)
const fileToModify = path.join(cloneDirectory, 'README.md');  // Example file
const commitMessage = 'Updated the README file';  // Commit message

// Initialize simple-git
const git = simpleGit();

// B4: Clone a Git repository, make a commit, and push it
async function cloneRepoAndCommit() {
    try {
        // Step 1: Clone the repository
        console.log('Cloning repository...');
        await git.clone(repoUrl, cloneDirectory);
        console.log('Repository cloned to:', cloneDirectory);

        // Step 2: Modify the file (e.g., appending some text to the README.md)
        const modificationText = '\n# New Changes\nThis is a new section added via a script.';
        fs.appendFileSync(fileToModify, modificationText, 'utf8');
        console.log('File modified:', fileToModify);

        // Step 3: Add the modified file to staging area
        await git.cwd(cloneDirectory);
        await git.add(fileToModify);
        console.log('File added to staging area');

        // Step 4: Commit the changes
        await git.commit(commitMessage);
        console.log('Commit made with message:', commitMessage);

        // Step 5: Push the changes to the repository (this requires authentication setup)
        await git.push('origin', 'main');  // Change 'main' if your branch is different
        console.log('Changes pushed to remote repository');
    } catch (err) {
        console.error('Error while cloning repo and making commit:', err.message);
    }
}

// Example usage: Clone repo and make a commit
cloneRepoAndCommit();

module.exports = { cloneRepoAndCommit };
