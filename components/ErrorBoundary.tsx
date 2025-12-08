"use client";

import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-tastia-dark flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-tastia-cream text-xl font-bold mb-2">حدث خطأ ما</h2>
                        <p className="text-tastia-cream/60 mb-4">نعتذر عن هذا الخطأ. يرجى تحديث الصفحة.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-tastia-primary to-tastia-secondary text-tastia-cream px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all"
                        >
                            تحديث الصفحة
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
