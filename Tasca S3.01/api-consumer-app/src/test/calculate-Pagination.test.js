import { describe, test, expect } from 'vitest';
import { calculatePagination } from '../calculate-Pagination';

describe('Testing calculatePagination function', () => {
    test(`Must display the correct number of pages`, () => {
    
    expect(calculatePagination(30, 10)).toBe(3);
    expect(calculatePagination(25, 10)).toBe(3);
    expect(calculatePagination(0, 10)).toBe(0);
    expect(calculatePagination(50, 10)).toBe(5);
    expect(calculatePagination(10, 10)).toBe(1);
    expect(calculatePagination(100, 10)).toBe(10);
    expect(calculatePagination(33, 10)).toBe(4);
    expect(calculatePagination(42, 10)).toBe(5);
    expect(calculatePagination(0, 10)).toBe(0);
    expect(calculatePagination(55, 10)).toBe(6);
    expect(calculatePagination(1, 10)).toBe(1);
    expect(calculatePagination(72, 10)).toBe(8);

    });
});