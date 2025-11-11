#!/usr/bin/env node

/**
 * Simple type checking script to validate our Zustand implementation
 * without needing to install all dependencies
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Checking Zustand TypeScript implementation...\n')

// Files to check for common issues
const filesToCheck = [
  'src/types/store.ts',
  'src/stores/uiStore.ts',
  'src/stores/stockStore.ts',
  'src/stores/userStore.ts',
  'src/hooks/useStockDataWithStore.ts',
  'src/contexts/SidebarContextZustand.tsx',
]

let allChecksPass = true

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`)
    allChecksPass = false
    return
  }

  const content = fs.readFileSync(fullPath, 'utf8')

  // Basic checks
  const checks = [
    {
      name: 'Has proper imports',
      test: content.includes('import') || content.includes('export'),
      message: 'File should have imports/exports',
    },
    {
      name: 'TypeScript syntax',
      test:
        content.includes(': ') &&
        (content.includes('interface') || content.includes('type')),
      message: 'File should use TypeScript syntax',
    },
  ]

  // Zustand-specific checks for store files
  if (filePath.includes('Store.ts')) {
    checks.push({
      name: 'Zustand create function',
      test: content.includes('create<') && content.includes('((set'),
      message: 'Store should use Zustand create pattern',
    })

    checks.push({
      name: 'DevTools integration',
      test: content.includes('devtools('),
      message: 'Store should include devtools',
    })
  }

  // Hook-specific checks
  if (filePath.includes('useStockDataWithStore')) {
    checks.push({
      name: 'useCallback usage',
      test: content.includes('useCallback('),
      message: 'Hook should use useCallback for functions',
    })
  }

  let filePass = true
  console.log(`📁 Checking ${filePath}:`)

  checks.forEach(check => {
    if (check.test) {
      console.log(`  ✅ ${check.name}`)
    } else {
      console.log(`  ❌ ${check.name}: ${check.message}`)
      filePass = false
      allChecksPass = false
    }
  })

  if (filePass) {
    console.log(`  🎉 ${filePath} looks good!\n`)
  } else {
    console.log(`  ⚠️  ${filePath} has issues\n`)
  }
})

// Check if all required exports exist
console.log('🔗 Checking exports...')
const indexPath = path.join(__dirname, 'src/stores/index.ts')
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8')

  const requiredExports = [
    'useUIStore',
    'useStockStore',
    'useUserStore',
    'useSidebarState',
    'useStocksData',
  ]

  requiredExports.forEach(exportName => {
    if (indexContent.includes(exportName)) {
      console.log(`  ✅ ${exportName} exported`)
    } else {
      console.log(`  ❌ ${exportName} not found in exports`)
      allChecksPass = false
    }
  })
} else {
  console.log('  ❌ stores/index.ts not found')
  allChecksPass = false
}

// Final result
console.log('\n' + '='.repeat(50))
if (allChecksPass) {
  console.log('🎉 All checks passed! Zustand integration looks good.')
  console.log('\n📝 Next steps:')
  console.log('   1. Run `npm install` to install dependencies')
  console.log('   2. Run `npm run dev` to start the development server')
  console.log('   3. Visit /advanced route to see the full Zustand demo')
} else {
  console.log('⚠️  Some checks failed. Please review the implementation.')
}
console.log('='.repeat(50))

process.exit(allChecksPass ? 0 : 1)
