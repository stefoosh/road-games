export const handleAsyncResponseJSON = async (response) => {
  if (response.ok) {
    console.debug(`${response.url} statusCode=${response.status}`);
    return response.json();
  }
  const error = await response.text();
  throw new Error(error);
};
