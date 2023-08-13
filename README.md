<center><h1>🚀 NestJS multi-tenancy blog engine - FRONTEND 🚀</h1></center>

## Description
A blog engine frontend created for the [Applifting](https://applifting.cz/) Full Stack Challenge. Explore [the assignment here](https://github.com/Applifting/fullstack-exercise).

## Application overview

### Technologies used
 - React + Typescript 
 - Redux (for state management)
 - Vite (for bundling)
 - Apollo Client and GraphQL (for live comments)
 - TailwindCSS + Flowbite (for styling)
 - Axios (for API calls)
 - Zod for validations
 - Toast for notifications
## Installation prerequisites

- Node.js v18.16.0
- NPM

## Installation (LOCAL)

```bash
# run npm install
$ npm install
# run app
$ npm run dev
```

Default tenant ID is <b>8e70bd91-628b-4459-ae38-954e88efc974</b>, use it like ``http://localhost:3000/8e70bd91-628b-4459-ae38-954e88efc974``

# Roadmap
### User Perspective

- [x] **Article List** 
  - [x] display a list of all articles, ordered by date descending
  - [x] each article should show title, perex and publication date
  - [x] each article should have a link to the full text

- [x] **Article View** 
  - [x] display an article
  - [x] article should be in markdown, take care of proper rendering

- [x] **New Article View** 
  - [x] display a page with form to add new article
  - [x] the form should take title, perex and content
  - [ ] the content should be in markdown, you can use some existing markdown editor
  - [x] add necessary validations

- [x] **Add Comment functionality**
  - [x] display comments on Article View page
  - [x] each comment should have content, timestamp and author
  - [x] add comment form to Article View page
  - [x] comment form should take author and content

- [x] **Add Comment voting functionality**
  - [x] add the ability to vote on comments (+/-)
  - [x] display score on each comment

### Admin Perspective

- [x] **Login Screen** 
  - [x] implement login
  - [x] after successful login redirect to next screen
  - [x] on unsuccessful login display error message

- [x] **My Article List**
  - [x] display table of all articles
  - [x] display a button to create new article
  - [x] implement edit and delete buttons

- [x] **Article Detail View**
  - [x] display editable sections of article
  - [x] implement publish button
  - [x] use some existing Markdown editor, unless you really want to implement your own

## Stay in touch

- Author - [Roman Filatov](https://github.com/rvfch)

