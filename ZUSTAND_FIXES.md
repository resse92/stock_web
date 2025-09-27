# Zustand Infinite Loop Fixes

This document explains the fixes applied to resolve the infinite loop and maximum update depth errors in the Zustand state management implementation.

## Issues Identified

### 1. Unstable References in useEffect Dependencies
**Problem**: useEffect hooks were including unstable references (like callback functions from Zustand selectors) in their dependency arrays, causing infinite re-renders.

**Solution**: 
- Removed unstable callbacks from useEffect dependency arrays
- Used direct state values instead of callback references where possible
- Separated effects that have different concerns

### 2. Object Recreation in Selector Hooks
**Problem**: Zustand selector hooks were returning new objects on every render, causing components to re-render unnecessarily.

**Solution**:
- Added `shallow` equality comparison to all selector hooks
- Imported `shallow` from `zustand/shallow` for proper comparison
- Applied to all store selectors: `useStocksData`, `useStockCache`, `useChartCache`, `useQuoteCache`, etc.

### 3. Lack of Memoization in Custom Hooks
**Problem**: Custom hooks were not memoizing their return values, causing parent components to re-render when the actual data hadn't changed.

**Solution**:
- Added `useMemo` to memoize selector results in custom hooks
- Memoized return objects from custom hooks to provide stable references
- Used proper dependency arrays for memoization

## Fixed Files

### `src/hooks/useStockDataWithStore.ts`
- Added `useMemo` import
- Memoized selector results to prevent object recreation
- Removed problematic dependencies from useEffect arrays
- Separated refresh interval logic into its own useEffect
- Added `useMemo` to return objects for stable references

### `src/stores/stockStore.ts`
- Added `shallow` import from zustand
- Applied shallow equality to all selector hooks:
  - `useStocksData`
  - `useStockCache`
  - `useChartCache`
  - `useQuoteCache`

### `src/stores/uiStore.ts`
- Added `shallow` import from zustand
- Applied shallow equality to all selector hooks:
  - `useSidebarState`
  - `useThemeState`
  - `useLoadingState`
  - `useModalState`

### `src/stores/userStore.ts`
- Added `shallow` import from zustand
- Applied shallow equality to all selector hooks:
  - `useWatchlist`
  - `usePortfolio`
  - `useUserSettings`
  - `useViewPreferences`
  - `useFavorites`

## Key Patterns Applied

### 1. Shallow Equality for Selectors
```typescript
export const useStocksData = () => {
  return useStockStore((state) => ({
    stocks: state.stocks,
    loading: state.loading.stocks,
    error: state.error.stocks,
    setStocks: state.setStocks,
    setStocksLoading: state.setStocksLoading,
    setStocksError: state.setStocksError,
  }), shallow);
};
```

### 2. Proper useEffect Dependencies
```typescript
// BEFORE (problematic)
useEffect(() => {
  if (stocks.length === 0) {
    fetchStocks();
  }
}, [fetchStocks, stocks.length]); // fetchStocks changes on every render

// AFTER (fixed)
useEffect(() => {
  if (stocksData.stocks.length === 0 && !stocksData.loading) {
    fetchStocks();
  }
}, [stocksData.stocks.length, stocksData.loading]); // Stable dependencies
```

### 3. Memoized Hook Returns
```typescript
return useMemo(() => ({
  stock,
  loading: isLoading,
  error: stockError,
  refetch: fetchStock,
}), [stock, isLoading, stockError, fetchStock]);
```

## Testing

Two test components were created to validate the fixes:

1. **`/test`** - Simple infinite loop detection test
2. **`/test-comprehensive`** - Comprehensive test suite that validates:
   - No infinite render loops
   - State changes don't cause infinite re-renders
   - Hook references are stable
   - Data operations work correctly
   - UI state changes work without issues

## Expected Results

After applying these fixes:
- ✅ No more "getSnapshot should be cached" warnings
- ✅ No more "Maximum update depth exceeded" errors
- ✅ Stable component rendering with minimal re-renders
- ✅ Proper state updates without infinite loops
- ✅ Improved performance due to fewer unnecessary renders

## Best Practices Going Forward

1. **Always use shallow equality** for Zustand selector hooks that return objects
2. **Avoid including unstable references** in useEffect dependency arrays
3. **Memoize return values** from custom hooks when they contain objects
4. **Separate concerns** in useEffect hooks - don't mix data fetching with intervals
5. **Test for infinite loops** when adding new hooks or effects

## Monitoring

Use the test components at `/test` and `/test-comprehensive` to verify that the fixes are working correctly in your environment. The comprehensive test will show render counts and validate that all operations work without causing infinite loops.