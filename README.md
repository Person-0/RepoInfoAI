# RepoInfoAI
Auto-send prompts to ChatGPT on the website that contains info about an arbitrary GitHub repository.

# Usage (only pc / desktop mode)
- start the local server and install the userscript
- Go to https://chatgpt.com
- Click on RepoInfo button at bottom right.
- Enter Repo name along with owner (eg. `BluZed/RepoInfoAI`)
- Enter the first prompt you want to ask ChatGPT about.
- **Important!!!** Allow the script to fetch cross-origin requests if prompted for. This is required to interact with the local server due to [csp headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) on the website.
- wait for the results!
- you may also continue the chats.

# Installation Instructions
Both of the following are required.

## 1. Userscript setup
(it requests the prompt data from the local server and sends it as chat prompt to ChatGPT)
- Install tampermonkey browser extension if not installed already
- Install the userscript from this repository.

## 2. Local server setup 
(it is responsible for the git api requests and parsing the prompts.)
- Ensure that you have (Node.js)[https://nodejs.org/en] installed on your system (project tested on Node.js [v20.12.2](https://nodejs.org/download/release/v20.12.2/)).
- Clone this repository OR download the source code as a zip file.

For cloning:
```bash
git clone https://github.com/BluZed/RepoInfoAI
```

For downloading as a zip: [click here](https://github.com/BluZed/RepoInfoAI/archive/refs/heads/main.zip)
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
