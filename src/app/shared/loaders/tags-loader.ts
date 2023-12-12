import { EntryLoader } from "../../server/ttl-cache";

  /**
   * Function that loads tags from the remote service
   * @returns Articles
   */
  export const tagsLoader: EntryLoader = async () => {
    const response = await fetch(
      `https://api.realworld.io/api/tags`
    );
    if (response.ok) {
      const tagsPayload = await response.json();
      return tagsPayload;
    } else {
      return null;
    }
  };
