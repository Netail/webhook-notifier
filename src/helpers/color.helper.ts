import { Color } from '../enums/color';

export const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
};

export const colorCheck = (input: string): string => {
    // Remove all non alphabetic and numeric characters
    const cleanInput = input.replace(/[^a-z0-9]/gi, '');

    // Check if input is in pre-defined colors
    const preColor = Color[cleanInput.toUpperCase()];

    return preColor ? preColor : cleanInput;
};
