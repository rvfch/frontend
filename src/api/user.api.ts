import Calls from '.';

const PREFIX = '/auth';

export const getMe = async () => {
  const response = await Calls.get(PREFIX + `/me`);
  return response.data;
};
