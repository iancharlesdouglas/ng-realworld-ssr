import express from 'express';
import { ArticleApiResponse } from '../features/home/model/article-api-response';
const app = express();
const port = 3000;

app.get('/api/articles', (req, res) => {
  const articleResponse: ArticleApiResponse = {
    articlesCount: 3,
    articles: [
      {
        title: 'Web Frameworks According to ChatGPT 3.5',
        description:
          'A summary of leading web frameworks according to ChatGPT 3.5, prompted to write a scathing though knowledgeable overview',
        body: `
Ah, the web frameworks, those self-proclaimed virtuosos of digital creation. Let's dissect this ensemble of tools, shall we?

React, the darling of Facebook, a declarative "efficiency" supposedly masking its virtual DOM charade. The initial load performance is, of course, tolerable, as long as you don't mind the orchestra of dependencies and the developer acrobatics required to optimize those components.

Angular, the Google-born TypeScript-based juggernaut. Its initial bundle, a veritable elephant in the room. Sure, it offers Ahead-of-Time compilation and lazy loading, but one wonders if the weight is worth the purported benefits. A symphony of features, but at what cost to the user's patience?
`,
        slug: 'web-frameworks-chatgpt-scathingly',
        tagList: ['webframeworks', 'frameworks', 'chatgpt', 'ai'],
        createdAt: new Date('2023-11-26T13:33:02'),
        updatedAt: new Date('2023-11-26T13:33:02'),
        author: { username: 'iandouglas', following: true },
        favorited: true,
        favoritesCount: 2,
      },
      {
        title: 'What about Vue.js?',
        description:
          'An overview of Vue.js as a modern web dev. framework according to ChatGPT 3.5 when asked to write a scathing review',
        body: `
        Vue.js, the "progressive" artisan of JavaScript, presenting simplicity as its virtue. The initial load, they claim, is a lightweight sonnet. Yet, the devil is in the details of how one structures and optimizes Vue components. Is it simplicity, or is it a cleverly veiled complexity?`,
        slug: 'web-frameworks-vuejs-chatgpt-scathingly',
        tagList: [
          'webframeworks',
          'frameworks',
          'chatgpt',
          'ai',
          'vuejs',
          'vue',
        ],
        createdAt: new Date('2023-11-26T13:33:02'),
        updatedAt: new Date('2023-11-26T13:33:02'),
        author: { username: 'iandouglas', following: true },
        favorited: true,
        favoritesCount: 1,
      },
      {
        title: 'What about Svelte then?',
        description:
          'An overview of Svelte as a modern web dev. framework according to ChatGPT 3.5 when asked to write a scathing review',
        body: `
        Svelte, the fresh-faced newcomer, boasting compilation sorcery during build-time. Initial load performance that 'whispers rather than shouts.' Well, forgive my skepticism, but let's see how well it fares when faced with real-world complexity.`,
        slug: 'web-frameworks-svelte-chatgpt-scathingly',
        tagList: ['webframeworks', 'frameworks', 'chatgpt', 'ai', 'svelte'],
        createdAt: new Date('2023-11-26T13:33:02'),
        updatedAt: new Date('2023-11-26T13:33:02'),
        author: { username: 'iandouglas', following: true },
        favorited: true,
        favoritesCount: 3,
      },
    ],
  };
  res.send(articleResponse);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
