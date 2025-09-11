# WeatherForecastApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiWeatherforecastGet**](#apiweatherforecastget) | **GET** /api/weatherforecast | |

# **apiWeatherforecastGet**
> Array<WeatherForecast> apiWeatherforecastGet()


### Example

```typescript
import {
    WeatherForecastApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WeatherForecastApi(configuration);

let days: number; // (optional) (default to 5)

const { status, data } = await apiInstance.apiWeatherforecastGet(
    days
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **days** | [**number**] |  | (optional) defaults to 5|


### Return type

**Array<WeatherForecast>**

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

