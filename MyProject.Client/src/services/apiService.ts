import { Configuration, TodoApi } from '../generated';

const apiConfig = new Configuration({
  basePath: '/api'
});

export const TodoApiService = new TodoApi(apiConfig);