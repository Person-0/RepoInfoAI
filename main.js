require('dotenv').config();
const fetch = require("cross-fetch");  
const express = require("express");
const app = express();

// Sets the git api auth header if specified in .env file
const authHeaders = {}
if(process.env.GHACCESSTOKEN && process.env.GHACCESSTOKEN.length){
    authHeaders["Authorization"] = "token " + process.env.GHACCESSTOKEN
}

// Send a "pong" for any other path
app.get("/*", (req, res) => {
    res.send("pong")
})

// the only request this app can handle
app.get("/process-repo", (req, res)=>{
    const repo = req.query["repo"]
    const search = req.query["q"]
    if(repo.length > 4 && repo.includes("/") && search.length > 2){
        process_repo(repo, search).then((data)=>{
            res.send(JSON.stringify(data))
        }).catch(reason=>{
            res.send(JSON.stringify({error:reason}))
        })
    }
})

// start local server on specified port or 4070
app.listen(process.env.PORT || 4070, ()=>{
    console.log("RepoInfoAI >> local server listening on port "+(process.env.PORT || 4070).toString())
    console.log(">> press ctrl+c to stop server.")
})

// Prompts can be edited as per the user's needs 
async function process_repo(repo, search) {
    const repoData = await getRepoData(repo, true)
    if(repoData.error){
        return repoData.error
    }

    let repo_items = "";
    let readmes_data = "[";
    (function rec(data) {
        for (const item of data) {
            if (item.type === "dir") {
                repo_items += item.path + "\n"
                rec(item.children)
            } else {
                repo_items += item.path + "\n"
                if (item.data) {
                    readmes_data += `"${item.path}":"${item.data}",`
                }
            }
        }
    })(repoData.contents);
    repo_items = repo_items.substring(0, repo_items.length - 2)
    readmes_data+="]"

    const parts_data = partsSplitter(`Repository files: ${repo_items}
Readme Data: ${readmes_data}`)

    const prompt_first = `The total length of the content that I want to send you is too large to send in only one piece.
        
For sending you that content, I will follow this rule:
        
[START PART 1/${parts_data.length}]
this is the content of the part 1 out of ${parts_data.length} in total
[END PART 1/${parts_data.length}]
        
Then you just answer: "Received part 1/${parts_data.length}"
        
And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.

`
    const prompt_last = `[ALL PARTS SENT]
You are a data search assistant tool to be used with GitHub. 
Your job is to help the user in their search query. 
Repository: ${repo}
Description: ${repoData.description || "unknown"}
License: ${repoData.license ? repoData.license.key : "unknown"}
Created: ${repoData.created_at || "unknown"}
Updated: ${repoData.updated_at || "unknown"}
Stars: ${repoData.stargazers_count || "unknown"}
Watchers: ${repoData.watchers_count || "unknown"}
Forks: ${repoData.forks_count || "unknown"}
Language: ${repoData.language || "unknown"}
Open Issues Count: ${repoData.open_issues_count || "unknown"}
Has been archived: ${repoData.archived || "unknown"}
Has been disabled: ${repoData.disabled || "unknown"}
README files data and all file paths with file name has been provided in the previous messages.
Search Item: ${search}
You can now give your output. You may request the user for providing the content of a specific file if needed. [ALL PARTS SENT]
`

    return {
        start: prompt_first,
        end: prompt_last,
        parts: parts_data
    }
}

// splits the long repo file paths and readme datas into parts and returns an array containing them.
function partsSplitter(text, partlen = (15000-330)) {
    const parts_num = Math.ceil(text.length / partlen)
    const parts = []
    for(let i = 1; i < parts_num+1; i++){
        const partData = text.substring(partlen*(i-1), (partlen*(i))+1)
        parts.push(`Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "Part ${i}/${parts_num} received" and wait for the next part.
[START PART ${i}/${parts_num}]
${partData}
[END PART ${i}/${parts_num}]
Remember not answering yet. Just acknowledge you received this part with the message "Part ${i}/${parts_num} received" and wait for the next part.`)
    }
    return parts
}

// get repo info
async function getRepoData(repo, includeFiles = false){
    const repodata = await fetch(`https://api.github.com/repos/${repo}`, {headers: authHeaders}).then(res => res.json())
    if(repodata.status === "404"){
        return {error: "repo not found"}
    }
    if(includeFiles){
        repodata.contents = await recursiveRepoFetch(repo, null, true)
    }
    return repodata
}

// get all files from the repo
async function recursiveRepoFetch(repo, path = null, includeMarkdown) {
    const structure = []
    const root = await fetch(`https://api.github.com/repos/${repo}/contents/${path ? path : ""}`, {headers: authHeaders}).then(res => res.json())
    if(!root.length){ throw "api request did not return an array. possible rate limit detected" }
    for (const item of root) {
        if (item.type === "dir") {
            const folroot = item
            // get files inside the folder
            folroot.children = await recursiveRepoFetch(repo, path ? path + "/" + item.name : item.name)
            structure.push(folroot)
        } else {
            if (includeMarkdown && item.name.endsWith(".md")) {
                // add the readme data
                const markdownfile = item
                markdownfile.data = await fetch(item.download_url).then(res => res.text())
                structure.push(markdownfile)
            } else {
                structure.push(item)
            }
        }

    }
    return structure
}