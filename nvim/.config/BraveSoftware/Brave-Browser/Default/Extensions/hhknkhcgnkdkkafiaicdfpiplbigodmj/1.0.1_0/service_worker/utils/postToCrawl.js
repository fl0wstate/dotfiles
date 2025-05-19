const postToCrawl = async (baseUrl) => {
  const url =
    `https://crawler.tools.cmlabs.dev/api-ext/tech-lookup?url=${baseUrl}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error in postToCrawl:", error);
    return null;
  }
};

export default postToCrawl;
