/**
 * @fileoverview Example custom component for use by MenuBar.stories.tsx.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, TextField } from "@mui/material";

export interface TableSizeChooserProps {
    maxRows?: number;
    maxCols?: number;
    currentRows: number;
    currentCols: number;
    onSizeSelect: (rows: number, cols: number) => void;
}

interface SizeInputProps {
    label: string
    value: string
    type: "rows" | "cols"
    max: number
    onChange: (type: "rows" | "cols", value: string) => void
    onBlur: () => void
    onFocus: () => void
}

function SizeInput({ label, value, type, max, onChange, onBlur, onFocus }: SizeInputProps) {
    return (
        <TextField
            label={label}
            value={value}
            onChange={(e) => onChange(type, e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            type="number"
            InputProps={{ inputProps: { min: 1, max } }}
            size="small"
        />
    )
}

const TableSizeChooser: React.FC<TableSizeChooserProps> = ({ maxRows = 20, maxCols = 20, currentRows, currentCols, onSizeSelect }) => {
    const [hoveredRow, setHoveredRow] = useState(0);
    const [hoveredCol, setHoveredCol] = useState(0);
    const [inputRows, setInputRows] = useState(currentRows.toString());
    const [inputCols, setInputCols] = useState(currentCols.toString());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setInputRows(currentRows.toString());
        setInputCols(currentCols.toString());
    }, [currentRows, currentCols]);

    const handleMouseEnter = useCallback((rowIndex: number, colIndex: number) => {
        setHoveredRow(rowIndex);
        setHoveredCol(colIndex);
        setInputRows((rowIndex + 1).toString());
        setInputCols((colIndex + 1).toString());
    }, []);

    const handleClick = useCallback(() => {
        onSizeSelect(hoveredRow + 1, hoveredCol + 1);
    }, [onSizeSelect, hoveredRow, hoveredCol]);

    const handleInputChange = useCallback(
        (type: "rows" | "cols", value: string) => {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue)) return;

            if (type === "rows") {
                setInputRows(value);
                setHoveredRow(Math.min(numValue - 1, maxRows - 1));
            } else {
                setInputCols(value);
                setHoveredCol(Math.min(numValue - 1, maxCols - 1));
            }
        },
        [maxRows, maxCols]
    );

    const handleInputBlur = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            const rows = Math.max(1, Math.min(parseInt(inputRows, 10), maxRows));
            const cols = Math.max(1, Math.min(parseInt(inputCols, 10), maxCols));
            onSizeSelect(rows, cols);
        }, 200);
    }, [inputRows, inputCols, maxRows, maxCols, onSizeSelect]);

    const handleInputFocus = () => {
        // Clear the timeout if user focuses on an input
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const inputs = [
        { label: 'Rows', value: inputRows, type: 'rows' as const, max: maxRows },
        { label: 'Columns', value: inputCols, type: 'cols' as const, max: maxCols }
    ]

    return (
        <Box sx={{ padding: 2, width: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                {inputs.map((input, index) => (
                    <React.Fragment key={input.type}>
                        <SizeInput
                            {...input}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onFocus={handleInputFocus}
                        />
                        {index === 0 && <Typography variant="h6">x</Typography>}
                    </React.Fragment>
                ))}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                }}
                onClick={handleClick}
                onMouseLeave={() => {
                    setHoveredRow(parseInt(inputRows, 10) - 1);
                    setHoveredCol(parseInt(inputCols, 10) - 1);
                }}
            >
                {[...Array(maxRows)].map((_, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: "flex",
                            gap: 0.5,
                        }}
                    >
                        {[...Array(maxCols)].map((_, colIndex) => (
                            <Box
                                key={colIndex}
                                sx={{
                                    width: 10,
                                    height: 10,
                                    border: rowIndex < currentRows && colIndex < currentCols ? "1px solid #000" : "1px solid #ccc",
                                    backgroundColor:
                                        rowIndex <= hoveredRow && colIndex <= hoveredCol
                                            ? "rgba(25, 118, 210, 0.12)"
                                            : rowIndex < currentRows && colIndex < currentCols
                                            ? "rgba(25, 118, 210, 0.12)"
                                            : "#fff",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TableSizeChooser;
