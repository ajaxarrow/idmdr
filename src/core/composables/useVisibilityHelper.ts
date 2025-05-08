export const useVisibilityHelper = () => {
    const getVisibilityLabel = (value: number): string => {
        switch (value) {
            case 1:
                return 'Public'
            case 2:
                return 'Private'
            case 3:
                return 'Within Organization'
            case 4:
                return 'Within All Organization'
            default:
                return 'Unknown'
        }
    }
    return { getVisibilityLabel }
}