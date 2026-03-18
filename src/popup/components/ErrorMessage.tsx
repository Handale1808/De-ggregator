interface Props {
  error: string
  onRetry?: () => void
  onOpenSettings?: () => void
}

export default function ErrorMessage({ error, onRetry, onOpenSettings }: Props) {
  const getMessage = () => {
    switch (error) {
      case 'QUOTA_EXCEEDED':
        return {
          title: 'Daily limit reached',
          body: 'You have used all 100 free searches for today. The limit resets at midnight.',
          action: null,
        }
      case 'INVALID_KEY':
        return {
          title: 'Invalid API credentials',
          body: 'Your API key or Search Engine ID appears to be incorrect.',
          action: 'Update credentials',
        }
      case 'NO_SETTINGS':
        return {
          title: 'No credentials saved',
          body: 'Please enter your Google API key and Search Engine ID to get started.',
          action: 'Enter credentials',
        }
      case 'NOT_SUPPORTED':
        return {
          title: 'Site not supported',
          body: 'This page is not a recognised news aggregator. Open an article on Yahoo News, MSN, Google News, Bing News, AOL, NewsBreak, Ground News, or NewsNow.',
          action: null,
        }
      default:
        return {
          title: 'Something went wrong',
          body: 'An unexpected error occurred. Please try again.',
          action: null,
        }
    }
  }

  const { title, body, action } = getMessage()

  return (
    <div className="p-4 w-80">
      <p className="text-xs font-semibold text-gray-800 mb-1">{title}</p>
      <p className="text-xs text-gray-500 mb-3">{body}</p>
      {action && onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="w-full bg-blue-600 text-white text-xs font-medium py-2 rounded hover:bg-blue-700"
        >
          {action}
        </button>
      )}
      {!action && onRetry && (
        <button
          onClick={onRetry}
          className="w-full bg-gray-100 text-gray-700 text-xs font-medium py-2 rounded hover:bg-gray-200"
        >
          Try again
        </button>
      )}
    </div>
  )
}