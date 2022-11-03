export const handleAsyncResponseJSON = async (response) => {
  if (response.ok) return response.json();
  const error = await response.text();
  throw new Error(error);
};
