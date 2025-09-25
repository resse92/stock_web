import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 right-0 h-screen bg-background border-l z-50
        transition-transform duration-300 ease-in-out
        w-96 lg:w-96
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">导航菜单</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-muted"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">功能菜单</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 股票监控</li>
                  <li>• 数据分析</li>
                  <li>• 投资组合</li>
                  <li>• 市场趋势</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">快速操作</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 刷新数据</li>
                  <li>• 导出报告</li>
                  <li>• 设置提醒</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
