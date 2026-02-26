'use client';
import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message: string; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: '' };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-7 h-7 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">{this.state.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, message: '' })}
                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
