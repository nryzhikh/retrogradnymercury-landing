// Типизация для window.ym
declare global {
  interface Window {
    ym?: (counterId: number, method: string, ...params: (string | object)[]) => void;
  }
}

export function trackPageView(counterId: string, url: string): void {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(Number(counterId), 'hit', url);
  }
}

export function trackEvent(counterId: string, eventName: string, params?: object): void {
  if (typeof window !== 'undefined' && window.ym) {
    if (params) {
      window.ym(Number(counterId), 'reachGoal', eventName, params);
    } else {
      window.ym(Number(counterId), 'reachGoal', eventName);
    }
  }
}
