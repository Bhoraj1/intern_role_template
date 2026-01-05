export const sendResponse = (
  res,
  { success = true, message, data = null, statusCode = 200 }
) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};
