export const blogs = [
  {
    slug: "react-interview-questions",

    title: "Top React Interview Questions for Frontend Developers",

    description:
      "Master React interview preparation with the most asked frontend interview questions and detailed explanations.",

    keywords:
      "react interview questions, frontend interview preparation, react js interview",

    image: "/og-image.png",

    category: "React",

    readTime: "10 min read",

    content: `
# Introduction

React is one of the most popular frontend libraries used in modern web development.

Companies frequently ask React interview questions for frontend developer roles.

This guide covers:

- React fundamentals
- Hooks
- Performance optimization
- Virtual DOM
- State management

# 1. What is Virtual DOM?

The Virtual DOM is a lightweight JavaScript representation of the real DOM.

React compares changes efficiently using reconciliation.

## Example

\`\`\`js
const element = <h1>Hello</h1>
\`\`\`

# 2. Difference between useMemo and useCallback

useMemo memoizes values.

useCallback memoizes functions.

## Example

\`\`\`js
const memoized = useMemo(() => compute(data), [data])
\`\`\`

# 3. Explain useEffect lifecycle

useEffect runs after rendering.

It supports:
- mount
- update
- cleanup

## Cleanup Example

\`\`\`js
useEffect(() => {
  return () => {
    console.log('cleanup')
  }
}, [])
\`\`\`

# Conclusion

Practicing these React concepts deeply helps crack frontend interviews.
`
  },

  {
    slug: "javascript-interview-questions",

    title: "JavaScript Interview Questions and Answers",

    description:
      "Prepare for frontend interviews with the most important JavaScript interview questions and concepts.",

    keywords:
      "javascript interview questions, closures, promises, event loop",

    image: "/og-image.png",

    category: "JavaScript",

    readTime: "12 min read",

    content: `
# Introduction

JavaScript fundamentals are extremely important for frontend interviews.

Strong JavaScript knowledge helps developers solve complex frontend problems.

# Important Topics

- Closures
- Event Loop
- Promises
- Async/Await
- Hoisting
- Debouncing
- Throttling

# 1. What is Closure?

A closure allows functions to access variables from outer scope even after execution.

## Example

\`\`\`js
function outer() {
  let count = 0

  return function inner() {
    count++
    return count
  }
}
\`\`\`

# 2. Explain Event Loop

JavaScript uses:
- Call stack
- Web APIs
- Callback queue
- Event loop

The event loop manages asynchronous execution.

# 3. Promises vs Async Await

Promises handle asynchronous operations.

Async/await provides cleaner syntax over promises.

# Conclusion

Mastering JavaScript fundamentals is critical for frontend interviews.
`
  },

  {
    slug: "frontend-developer-roadmap",

    title: "Frontend Developer Roadmap 2026",

    description:
      "Complete roadmap to become a frontend developer in 2026 with React, JavaScript, TypeScript, and performance optimization.",

    keywords:
      "frontend roadmap, react roadmap, frontend developer skills",

    image: "/og-image.png",

    category: "Frontend",

    readTime: "15 min read",

    content: `
# Introduction

Frontend development is evolving rapidly.

Modern frontend engineers need strong fundamentals and practical skills.

# Step 1 — Learn HTML & CSS

Understand:
- semantic HTML
- Flexbox
- Grid
- responsive design

# Step 2 — Master JavaScript

Important concepts:
- closures
- async/await
- promises
- event loop
- DOM manipulation

# Step 3 — Learn React

Focus on:
- components
- hooks
- state management
- routing
- optimization

# Step 4 — Learn TypeScript

TypeScript improves:
- scalability
- maintainability
- developer experience

# Step 5 — Performance Optimization

Important topics:
- lazy loading
- memoization
- bundle optimization

# Step 6 — Prepare for Interviews

Practice:
- DSA
- frontend machine coding
- React interview questions
- communication skills

# Conclusion

Consistent learning and project building are key to frontend success.
`
  }
]