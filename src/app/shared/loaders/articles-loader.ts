import { EntryLoader } from "../../server/ttl-cache";

  /**
   * Function that loads articles from the remote service
   * @returns Articles
   */
  export const articlesLoader: EntryLoader = async () => {
    const response = await fetch(
      `https://api.realworld.io/api/articles`
    );
    if (response.ok) {
      const articlesPayload = await response.json();
      return articlesPayload;
    } else {
      return null;
    }
  };
