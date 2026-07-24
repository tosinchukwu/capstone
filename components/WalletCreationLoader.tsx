// components/WalletCreationLoader.tsx
export default function WalletCreationLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Creating your wallet...</p>
        <p className="text-xs text-gray-400 mt-2">This may take a few seconds.</p>
      </div>
    </div>
  );
}