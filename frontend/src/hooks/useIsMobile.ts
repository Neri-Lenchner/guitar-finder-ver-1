export function useIsMobile(): boolean {
    return window.matchMedia('(max-width: 768px)').matches;
}
