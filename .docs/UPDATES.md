<!-- =================================================================
# Application Updates \& Event Log
# Created July 24, 2026
# Purpose: Track changes made to the application
#================================================================= -->

> **This is a live document; keep it to track your work on this project**
> **Keep all formatting consistent, include the current date, your tag/id, and the tasks you completed/contributed**

**Updates: July 22, 2026**
@jrb - posted bug fix requirements for dev team

**Updates: July 24, 2026**
@jrb - created Yaml script with Github 'Actions' config settings to automatically trigger deploy of commits to dev branch to Netlify in real time, bypassing contributor limitation.
@enoch - updated image path in source code to fix image display issues on website
@enoch - updated source code to address bug fix issues posted on 7.22.26
@jrb - created deployment automation using Netlify build hook to trigger new commits to dev branch to deploy in Netlify in real time; varition 2 of Yaml script.

**Updates: July. 30, 2026**
@enoch - deployed changes per bug fix instructions (see email)

**Updates: Aug. 3, 2026**
@jrb - test 07.30.26 code deploy to ensure all bug fix issues are satisfied
@jrb - deployed changes to repo and checked Netlify status
@leo - setup local dev environment for claude code
@leo - begin code refactor

**Updates: Aug. 4, 2026**
@jrb - begin code review
@jrb - reviewed requirements to deploy site to dedicated VPS and migrate away from Netlify

**Updates: Aug. 5, 2026**
@jrb - code updates to index.tsx file
@jrb - revised project deployment direction and scope
@jrb - updated project instructions, readme, deployment, and claude.md files accordingly
@jrb - initiated full code refactor with claude code
@jrb - executed configuration settings for vps/da hosting environment deployment target
@claude - completed Phase 1 documentation audit: standardized secrets path on private/.env across CLAUDE.md/DEPLOYMENT.md/INSTRUCTIONS.txt/README.md; documented Events and Event RSVPs Airtable tables found in code; flagged hardcoded Airtable webhook URL (src/routes/api/inquire.ts) and a historically-committed .env file for credential rotation; hardened .gitignore; removed stray junk "gitignore" file. No application code changed.







