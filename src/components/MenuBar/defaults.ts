/**
 * @fileoverview Default configurations for the MenuBar component and its
 * subcomponents.
 */

import { MenuConfig, MenuBarProps } from "./types";
import { FileCopy, FolderOpen, Save, ExitToApp, Undo, Redo, ContentCopy, ContentPaste, Visibility, ZoomIn, ZoomOut } from "@mui/icons-material";
import TableSizeChooser from "../TableSizeChooser";
import React from 'react';

/** Default values for MenuConfig */
export const DEFAULT_MENU_CONFIG: Required<MenuConfig> = {
    label: "Root",
    disabled: false,
    items: [
        {
            kind: "submenu",
            label: "File",
            items: [
                { kind: "action", label: "Hello", action: () => console.log("New file"), icon: FileCopy, shortcut: "Ctrl+S" },
                { kind: "action", label: "Open", action: () => console.log("Open file action triggered"), icon: FolderOpen, disabled: true },
                { kind: "divider" },
                { kind: "action", label: "Save", action: () => console.log("Save file"), icon: Save },
                { kind: "action", label: "Exit", action: () => console.log("Exit application"), icon: ExitToApp },
            ],
        },
        {
            kind: "submenu",
            label: "Table",
            items: [
                {
                    kind: "component" as const,
                    component: React.createElement(TableSizeChooser, {
                        maxRows: 10,
                        maxCols: 10,
                        currentRows: 3,
                        currentCols: 3,
                        onSizeSelect: (rows: number, cols: number) => 
                            console.log(`Selected size: ${rows}x${cols}`)
                    })
                }
            ]
        }
    ],
};

/** Default values for MenuBar props */
export const DEFAULT_MENU_BAR_PROPS: Required<Omit<MenuBarProps, "config" | "sx">> = {
    colorTheme: "light",
    color: "transparent" as const,
    transitionDuration: 0,
    disableRipple: true,
};
