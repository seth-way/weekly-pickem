import axios from 'axios';

export const fetchResolvedPicks = async () => {
  const { data } = await axios.get('/api/picks');
  return data.filter(pick => pick.success);
};
