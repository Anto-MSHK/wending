/**
 * Error Page
 * 
 * Displayed when guest token is invalid or missing.
 * Simple, user-friendly message with no technical details.
 */

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
            <div className="text-center px-6">
                <div className="text-6xl mb-6">💔</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Недействительная ссылка
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    К сожалению, эта ссылка недействительна или истекла.
                    Пожалуйста, проверьте ссылку из вашего приглашения.
                </p>
                <p className="text-sm text-gray-500">
                    Если проблема сохраняется, свяжитесь с нами.
                </p>
            </div>
        </div>
    );
}
