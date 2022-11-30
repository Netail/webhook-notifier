import { Color } from '../enums/color';

export const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
}

export const normalizeColor = (input: string): string => {
    // Remove all non alphabetic and numeric characters
    const cleanInput = input.replace(/[^a-z0-9]/gi, '');

    // Check if input is in pre-defined colors
    switch (cleanInput.toLowerCase()) {
        case 'success':
        case 'opened':
            return Color.GREEN;
        case 'failure':
        case 'closed':
            return Color.RED;
        case 'merged':
            return Color.PURPLE;
        case 'info':
            return Color.BLUE;
        case 'warning':
            return Color.YELLOW;
        case 'cancelled':
            return Color.GREY;
        default:
            return cleanInput;
    }
}
