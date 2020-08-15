import PlayMedia from './media/playMedia';
import { read } from './media/api-media';

const routes = [
  {
    path: '/media/:mediaId',
    component: PlayMedia,
    loadData: (params) => read(params),
  },

];

export default routes;
