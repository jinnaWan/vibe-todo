# TodoApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTodo**](#createtodo) | **POST** /api/todos | |
|[**deleteTodo**](#deletetodo) | **DELETE** /api/todos/{id} | |
|[**getAllTodos**](#getalltodos) | **GET** /api/todos | |
|[**getTodoById**](#gettodobyid) | **GET** /api/todos/{id} | |
|[**updateTodo**](#updatetodo) | **PUT** /api/todos/{id} | |

# **createTodo**
> Todo createTodo()


### Example

```typescript
import {
    TodoApi,
    Configuration,
    Todo
} from './api';

const configuration = new Configuration();
const apiInstance = new TodoApi(configuration);

let todo: Todo; // (optional)

const { status, data } = await apiInstance.createTodo(
    todo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todo** | **Todo**|  | |


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTodo**
> deleteTodo()


### Example

```typescript
import {
    TodoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodoApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteTodo(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllTodos**
> Array<Todo> getAllTodos()


### Example

```typescript
import {
    TodoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodoApi(configuration);

const { status, data } = await apiInstance.getAllTodos();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<Todo>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTodoById**
> Todo getTodoById()


### Example

```typescript
import {
    TodoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TodoApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getTodoById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**Todo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTodo**
> updateTodo()


### Example

```typescript
import {
    TodoApi,
    Configuration,
    Todo
} from './api';

const configuration = new Configuration();
const apiInstance = new TodoApi(configuration);

let id: number; // (default to undefined)
let todo: Todo; // (optional)

const { status, data } = await apiInstance.updateTodo(
    id,
    todo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **todo** | **Todo**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

