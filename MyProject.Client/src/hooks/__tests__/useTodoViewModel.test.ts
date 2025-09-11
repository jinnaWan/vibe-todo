import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoViewModel } from '../useTodoViewModel';
import { TodoApiService } from '../../services/apiService';
import { Todo } from '../../generated';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Mock the TodoApiService
vi.mock('../../services/apiService', async () => {
  const actual = await vi.importActual('../../services/apiService');
  return {
    ...actual,
    TodoApiService: {
      getAllTodos: vi.fn(),
      getTodoById: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn()
    }
  };
});

describe('useTodoViewModel', () => {
  const mockTodos: Todo[] = [
    { id: 1, title: 'Test Todo 1', isCompleted: false },
    { id: 2, title: 'Test Todo 2', isCompleted: true }
  ];

  const createMockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations - note they return AxiosResponse objects
    vi.mocked(TodoApiService.getAllTodos).mockResolvedValue(
      createMockAxiosResponse(mockTodos)
    );
    
    vi.mocked(TodoApiService.createTodo).mockImplementation(
      (todo?: Todo) => Promise.resolve(createMockAxiosResponse({ id: 3, ...todo }))
    );
    
    vi.mocked(TodoApiService.updateTodo).mockResolvedValue(
      createMockAxiosResponse(undefined)
    );
    
    vi.mocked(TodoApiService.deleteTodo).mockResolvedValue(
      createMockAxiosResponse(undefined)
    );
  });
  
  it('should fetch todos on initialization', async () => {
    const { result } = renderHook(() => useTodoViewModel());
    
    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    
    // Wait for the useEffect to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(TodoApiService.getAllTodos).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle fetch todos error', async () => {
    vi.mocked(TodoApiService.getAllTodos).mockRejectedValue(new Error('API error'));
    
    const { result } = renderHook(() => useTodoViewModel());
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.error).not.toBeNull();
    expect(result.current.error).toContain('Failed to fetch todos');
  });
  
  it('should add a new todo', async () => {
    const { result } = renderHook(() => useTodoViewModel());
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Set new todo title
    act(() => {
      result.current.setNewTodoTitle('New Todo Item');
    });
    
    expect(result.current.newTodoTitle).toBe('New Todo Item');
    
    // Add the todo
    await act(async () => {
      await result.current.addTodo();
    });
    
    expect(TodoApiService.createTodo).toHaveBeenCalledWith({
      title: 'New Todo Item',
      isCompleted: false
    });
    expect(result.current.newTodoTitle).toBe('');
    expect(result.current.todos.length).toBe(3);
  });
  
  it('should not add a todo if the title is empty', async () => {
    const { result } = renderHook(() => useTodoViewModel());
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Try to add with empty title
    await act(async () => {
      await result.current.addTodo();
    });
    
    expect(TodoApiService.createTodo).not.toHaveBeenCalled();
  });
  
  it('should toggle todo completion status', async () => {
    const { result } = renderHook(() => useTodoViewModel());
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Toggle the first todo
    await act(async () => {
      await result.current.toggleTodoCompletion(1);
    });
    
    expect(TodoApiService.updateTodo).toHaveBeenCalledWith(1, {
      id: 1,
      title: 'Test Todo 1',
      isCompleted: true
    });
    
    // The todo should now be completed in the state
    expect(result.current.todos[0].isCompleted).toBe(true);
  });
  
  it('should delete a todo', async () => {
    const { result } = renderHook(() => useTodoViewModel());
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Delete the first todo
    await act(async () => {
      await result.current.deleteTodo(1);
    });
    
    expect(TodoApiService.deleteTodo).toHaveBeenCalledWith(1);
    
    // The todo should be removed from the state
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].id).toBe(2);
  });
}); 