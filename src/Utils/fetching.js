export const fetchUri = async (uri) => {
  console.debug(`${uri} fetching`);
  const response = await fetch(uri).then(handleAsyncResponseJSON);
  // console.debug(JSON.stringify(response));
  return response;
};

export const handleAsyncResponseJSON = async (response) => {
  if (response.ok) {
    console.debug(`${response.url} statusCode=${response.status}`);
    return response.json();
  }
  const error = await response.text();
  throw new Error(error);
};
