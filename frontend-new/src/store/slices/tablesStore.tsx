/**
 * Tables Store with API integration using React Context
 */

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import apiService from '../../services/apiService.js'
import type { Table, Status } from '../../lib/types'

// State types
interface TablesState {
    tables: Table[]
    loading: boolean
    error: string | null
}

// Action types
type TablesAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Table[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'CREATE_SUCCESS'; payload: Table }
    | { type: 'UPDATE_SUCCESS'; payload: Table }
    | { type: 'DELETE_SUCCESS'; payload: string }
    | { type: 'CLEAR_ERROR' }

// Context type
interface TablesContextType {
    state: TablesState
    actions: {
        fetchTables: () => Promise<void>
        createTable: (data: { name: string }) => Promise<void>
        updateTable: (id: string, data: Partial<{ name: string; status?: Status }>) => Promise<void>
        deleteTable: (id: string) => Promise<void>
        updateTableStatus: (id: string, status: Status) => Promise<void>
        clearError: () => void
    }
}

// Initial state
const initialState: TablesState = {
    tables: [],
    loading: false,
    error: null,
}

// Reducer
const tablesReducer = (state: TablesState, action: TablesAction): TablesState => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, tables: action.payload }
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload }
        case 'CREATE_SUCCESS':
            return { ...state, loading: false, tables: [...state.tables, action.payload] }
        case 'UPDATE_SUCCESS':
            return {
                ...state,
                loading: false,
                tables: state.tables.map((table) =>
                    table.id === action.payload.id ? action.payload : table,
                ),
            }
        case 'DELETE_SUCCESS':
            return {
                ...state,
                loading: false,
                tables: state.tables.filter((table) => table.id !== action.payload),
            }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

// Context
const TablesContext = createContext<TablesContextType | null>(null)

// Provider component
export function TablesProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(tablesReducer, initialState)

    // Actions
    const fetchTables = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const tables = await apiService.table.getAll()
            dispatch({ type: 'FETCH_SUCCESS', payload: tables })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to fetch tables',
            })
        }
    }, [])

    const createTable = useCallback(async (data: { name: string }) => {
        dispatch({ type: 'FETCH_START' })
        try {
            const newTable = await apiService.table.create({
                table_name: data.name,
            })
            dispatch({ type: 'CREATE_SUCCESS', payload: newTable })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to create table',
            })
        }
    }, [])

    const updateTable = useCallback(
        async (id: string, data: Partial<{ name: string; status?: Status }>) => {
            dispatch({ type: 'FETCH_START' })
            try {
                // Since apiService.table doesn't have update method for table name,
                // we'll just update status if provided
                if (data.status) {
                    const updatedTable = await apiService.table.updateStatus(id, data.status)
                    dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTable })
                } else {
                    // For now, we can't update table name through the existing API
                    throw new Error('Table name update not supported by current API')
                }
            } catch (error) {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: error instanceof Error ? error.message : 'Failed to update table',
                })
            }
        },
        [],
    )

    const updateTableStatus = useCallback(async (id: string, status: Status) => {
        dispatch({ type: 'FETCH_START' })
        try {
            const updatedTable = await apiService.table.updateStatus(id, status)
            dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTable })
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to update table status',
            })
        }
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleteTable = useCallback(async (id: string) => {
        dispatch({ type: 'FETCH_START' })
        try {
            // Note: Table delete is not available in the current API service
            // This functionality would need to be implemented in the backend first
            throw new Error('Table deletion not supported by current API')
        } catch (error) {
            dispatch({
                type: 'FETCH_ERROR',
                payload: error instanceof Error ? error.message : 'Failed to delete table',
            })
        }
    }, [])

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' })
    }, [])

    const value: TablesContextType = {
        state,
        actions: {
            fetchTables,
            createTable,
            updateTable,
            updateTableStatus,
            deleteTable,
            clearError,
        },
    }

    return <TablesContext.Provider value={value}>{children}</TablesContext.Provider>
}

// Hook to use tables context
export function useTables() {
    const context = useContext(TablesContext)
    if (!context) {
        throw new Error('useTables must be used within a TablesProvider')
    }
    return context
}
