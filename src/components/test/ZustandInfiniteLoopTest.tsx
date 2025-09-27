/**
 * Test component to verify that Zustand infinite loop issues are fixed
 * This component exercises the problematic patterns that were causing issues
 */

import React, { useEffect, useState } from 'react';
import { useStockDataWithStore, useStockWithStore } from '@/hooks/useStockDataWithStore';
import { useSidebarState, useThemeState } from '@/stores';

export const ZustandInfiniteLoopTest: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRender, setLastRender] = useState(Date.now());

  // These hooks were causing infinite loops
  const stocksData = useStockDataWithStore();
  const stockData = useStockWithStore('AAPL');
  const sidebarState = useSidebarState();
  const themeState = useThemeState();

  // Count renders to detect infinite loops
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRender(Date.now());
  });

  // If render count goes above 20, we likely have an infinite loop
  const hasInfiniteLoop = renderCount > 20;

  return (
    <div style={{ 
      padding: '20px', 
      border: hasInfiniteLoop ? '2px solid red' : '2px solid green',
      backgroundColor: hasInfiniteLoop ? '#ffebee' : '#e8f5e8'
    }}>
      <h3>Zustand Infinite Loop Test</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Render Count:</strong> {renderCount}
        {hasInfiniteLoop && (
          <span style={{ color: 'red', marginLeft: '10px' }}>
            ⚠️ INFINITE LOOP DETECTED!
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Last Render:</strong> {new Date(lastRender).toLocaleTimeString()}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Stocks Loading:</strong> {stocksData.loading ? 'Yes' : 'No'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Stocks Count:</strong> {stocksData.stocks.length}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>AAPL Stock Loading:</strong> {stockData.loading ? 'Yes' : 'No'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Sidebar Collapsed:</strong> {sidebarState.isCollapsed ? 'Yes' : 'No'}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Theme:</strong> {themeState.theme}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={sidebarState.toggleSidebar}>
          Toggle Sidebar
        </button>
        <button 
          onClick={() => themeState.setTheme(themeState.theme === 'dark' ? 'light' : 'dark')}
          style={{ marginLeft: '10px' }}
        >
          Toggle Theme
        </button>
        <button 
          onClick={() => stocksData.refetch()}
          style={{ marginLeft: '10px' }}
        >
          Refetch Stocks
        </button>
      </div>

      {!hasInfiniteLoop && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          ✅ No infinite loop detected! Zustand hooks are working correctly.
        </div>
      )}
    </div>
  );
};

export default ZustandInfiniteLoopTest;