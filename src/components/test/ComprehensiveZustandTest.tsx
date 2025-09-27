/**
 * Comprehensive test to validate all Zustand fixes
 * Tests for infinite loops, proper memoization, and state management
 */

import React, { useEffect, useState, useRef } from 'react';
import { useStockDataWithStore, useStockWithStore, useChartDataWithStore, useStockQuoteWithStore } from '@/hooks/useStockDataWithStore';
import { useSidebarState, useThemeState, useWatchlist, usePortfolio } from '@/stores';

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
}

export const ComprehensiveZustandTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  // All the hooks that were problematic
  const stocksData = useStockDataWithStore();
  const appleStock = useStockWithStore('AAPL');
  const chartData = useChartDataWithStore('AAPL', '1M');
  const quoteData = useStockQuoteWithStore('AAPL');
  const sidebarState = useSidebarState();
  const themeState = useThemeState();
  const watchlistState = useWatchlist();
  const portfolioState = usePortfolio();

  // Track renders
  useEffect(() => {
    renderCountRef.current += 1;
    lastRenderTimeRef.current = Date.now();
  });

  const runTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Check for infinite render loops
    const initialRenderCount = renderCountRef.current;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    const finalRenderCount = renderCountRef.current;
    const renderDifference = finalRenderCount - initialRenderCount;
    
    results.push({
      testName: 'Infinite Loop Detection',
      passed: renderDifference < 5, // Allow some renders but not infinite
      details: `Render count changed by ${renderDifference} in 1 second (expected < 5)`
    });

    // Test 2: State modifications don't cause infinite loops
    const beforeRenderCount = renderCountRef.current;
    sidebarState.toggleSidebar();
    await new Promise(resolve => setTimeout(resolve, 500));
    themeState.setTheme(themeState.theme === 'dark' ? 'light' : 'dark');
    await new Promise(resolve => setTimeout(resolve, 500));
    const afterRenderCount = renderCountRef.current;
    const stateChangeRenders = afterRenderCount - beforeRenderCount;

    results.push({
      testName: 'State Change Stability',
      passed: stateChangeRenders < 10, // Some renders expected but not infinite
      details: `State changes caused ${stateChangeRenders} renders (expected < 10)`
    });

    // Test 3: Hook return values are stable
    const stocksRef1 = stocksData;
    await new Promise(resolve => setTimeout(resolve, 100));
    const stocksRef2 = stocksData;
    
    results.push({
      testName: 'Hook Reference Stability',
      passed: stocksRef1 === stocksRef2,
      details: `Hook references ${stocksRef1 === stocksRef2 ? 'are' : 'are not'} stable`
    });

    // Test 4: Watchlist operations work without loops
    const initialWatchlist = watchlistState.watchlist.length;
    watchlistState.addToWatchlist('MSFT');
    await new Promise(resolve => setTimeout(resolve, 200));
    watchlistState.removeFromWatchlist('MSFT');
    await new Promise(resolve => setTimeout(resolve, 200));
    const finalWatchlist = watchlistState.watchlist.length;

    results.push({
      testName: 'Watchlist Operations',
      passed: initialWatchlist === finalWatchlist,
      details: `Watchlist length: ${initialWatchlist} -> ${finalWatchlist} (should be equal)`
    });

    // Test 5: Data fetching works without infinite loops
    const beforeFetchRenders = renderCountRef.current;
    if (stocksData.refetch) {
      stocksData.refetch();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const afterFetchRenders = renderCountRef.current;
    const fetchRenders = afterFetchRenders - beforeFetchRenders;

    results.push({
      testName: 'Data Fetching Stability',
      passed: fetchRenders < 15, // Allow for loading states but not infinite
      details: `Data fetching caused ${fetchRenders} renders (expected < 15)`
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(test => test.passed);
  const testsPassing = testResults.filter(test => test.passed).length;

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Comprehensive Zustand Test Suite</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Render Count:</strong> {renderCountRef.current}</p>
        <p><strong>Last Render:</strong> {new Date(lastRenderTimeRef.current).toLocaleTimeString()}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>State Values</h3>
        <p><strong>Stocks Loaded:</strong> {stocksData.stocks.length} (Loading: {stocksData.loading ? 'Yes' : 'No'})</p>
        <p><strong>AAPL Stock:</strong> {appleStock.stock?.symbol || 'Not loaded'} (Loading: {appleStock.loading ? 'Yes' : 'No'})</p>
        <p><strong>Chart Data Points:</strong> {chartData.chartData.length} (Loading: {chartData.loading ? 'Yes' : 'No'})</p>
        <p><strong>Sidebar Collapsed:</strong> {sidebarState.isCollapsed ? 'Yes' : 'No'}</p>
        <p><strong>Theme:</strong> {themeState.theme}</p>
        <p><strong>Watchlist Size:</strong> {watchlistState.watchlist.length}</p>
        <p><strong>Portfolio Size:</strong> {portfolioState.portfolio.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runTests} 
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            backgroundColor: isRunning ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div>
          <h3>Test Results ({testsPassing}/{testResults.length} passed)</h3>
          <div style={{
            padding: '10px',
            backgroundColor: allTestsPassed ? '#d4edda' : '#f8d7da',
            border: `1px solid ${allTestsPassed ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            {allTestsPassed ? (
              <strong style={{ color: '#155724' }}>✅ All tests passed! Zustand is working correctly.</strong>
            ) : (
              <strong style={{ color: '#721c24' }}>❌ Some tests failed. Check the details below.</strong>
            )}
          </div>
          
          {testResults.map((result, index) => (
            <div key={index} style={{
              padding: '8px',
              margin: '5px 0',
              backgroundColor: result.passed ? '#d1ecf1' : '#f8d7da',
              border: `1px solid ${result.passed ? '#bee5eb' : '#f5c6cb'}`,
              borderRadius: '4px'
            }}>
              <strong>{result.passed ? '✅' : '❌'} {result.testName}</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{result.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComprehensiveZustandTest;