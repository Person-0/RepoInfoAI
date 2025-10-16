<img width="100" src="https://github.com/Person-0/RepoInfoAI/blob/main/assets/openai_logo.png?raw=true"></img>
<img width="100" src="https://github.com/Person-0/RepoInfoAI/blob/main/assets/github_logo.png?raw=true"></img>
# RepoInfoAI
> ChatGPT can access your repositories if prompted without the need of using this program so I have archived this project.

Auto-send prompts to ChatGPT on the website that contains info about an arbitrary GitHub repository.<br>
The information includes:
- Name
- Description
- Files (including those in subfolders)
- Content inside .md files
- Created & Last updated at
- Open Issues count
- License
- Stars
- Watchers
- Forks
- Main language
- Is archived / disabled
<br>
ChatGPT can further be asked about any information related to the given information.
For example, you may ask it to point out files in which a specific logic of the project may be.
Or, you may ask it to generate an essay regarding the project. Anything infact.

https://github.com/user-attachments/assets/ed70ab32-fe8e-499e-9e98-175e7312bcc9

Prompts can be edited in main.js<br>
Improvements and PRs are welcome!<br>
# Usage (only pc / desktop mode)
- Start the local server and install the userscript (steps mentioned in Installation Instructions below)
- Go to https://chatgpt.com
- Click on RepoInfo button at bottom right.
- Enter Repo name along with owner (eg. `Person-0/RepoInfoAI`)
- Enter the first prompt you want to ask ChatGPT about.
- **Important!!!** Allow the script to fetch cross-origin requests if prompted for. This is required to interact with the local server due to [csp headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) on the website.
- wait for the results! It may take some time for large repositories.
- you may also continue the chats.

# Installation Instructions
Both of the following are required.

## 1. Userscript setup
(it requests the prompt data from the local server and sends it as chat prompt to ChatGPT)
- Install tampermonkey browser extension if not installed already
- Install the [userscript from this repository](https://github.com/Person-0/RepoInfoAI/raw/refs/heads/main/web.user.js).

## 2. Local server setup 
(it is responsible for the git api requests and parsing the prompts.)
- Ensure that you have [Node.js](https://nodejs.org/en) installed on your system (project tested on Node.js [v20.12.2](https://nodejs.org/download/release/v20.12.2/)).
- Clone this repository OR download the source code as a zip file.

For cloning:
```bash
git clone https://github.com/Person-0/RepoInfoAI
```

For downloading as a zip: [click here](https://github.com/Person-0/RepoInfoAI/archive/refs/heads/main.zip)
- Extract the zip contents into a folder.
- cd into the repo contents.
```bash
cd RepoInfoAI
```
- Install all npm dependencies
```bash
npm i
```
- Get your github access token (optional, recommended due to [rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28)) and add it to the .env file.
```
GHACCESSTOKEN=<YOUR TOKEN HERE>
```
You may also add a ```PORT=<custom port number>``` to modify the default PORT (4070) at which the server runs on, but please also edit it in the userscript else it will break.
- Start the local server 
```bash
npm start
```

# Credits
- https://github.com/KudoAI/chatgpt.js/
- https://medium.com/@josediazmoreno/break-the-limits-send-large-text-blocks-to-chatgpt-with-ease-6824b86d3270
