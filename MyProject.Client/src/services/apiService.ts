import { Configuration, TodoApi } from '../generated';

const apiConfig = new Configuration({
  basePath: ''
});

export const TodoApiService = new TodoApi(apiConfig);