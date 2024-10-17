/**
 * @fileoverview Exports the MenuBar component, which renders a configurable
 * menu bar using Material-UI components. Handles state management for menu
 * interactions and integrates with keyboard navigation utilities.
 */

import React, { useState, useCallback } from "react";
import { AppBar, createTheme, CssBaseline, ThemeProvider, Toolbar } from "@mui/material";
import { MenuBarProps } from "./types";
import RenderMenuTopLevel from "./RenderMenuTopLevel";
import { useMenuHotkeys } from "./utils";

const muiDarkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});
const muiLightTheme = createTheme({
    palette: {
        mode: "light",
    },
});
const MenuBar: React.FC<MenuBarProps> = ({ config = [], colorTheme = "light", sx }) => {
    /** Sets up keyboard shortcuts. */
    useMenuHotkeys(config);
    /** Tracks the currently open menu and its anchor element. */
    const [openMenu, setOpenMenu] = useState<{ menuIndex: number; menuAnchor: HTMLElement } | null>(null);

    /** Opens the menu at the specified index when clicked. */
    const handleClick = useCallback((mouseEvent: React.MouseEvent<HTMLButtonElement>, menuIndex: number) => {
        setOpenMenu({ menuIndex: menuIndex, menuAnchor: mouseEvent.currentTarget });
    }, []);

    /** Sets openMenu to null, preventing submenus from rendering. */
    const handleClose = useCallback(() => {
        setOpenMenu(null);
    }, []);

    /** Prevents default for Enter/Space/ArrowDown, then sets open menu state with current index and target. */
    const handleKeyDown = useCallback((keyBoardEvent: React.KeyboardEvent<HTMLButtonElement>, menuIndex: number) => {
        if (["Enter", " ", "ArrowDown"].includes(keyBoardEvent.key)) {
            keyBoardEvent.preventDefault();
            setOpenMenu({ menuIndex: menuIndex, menuAnchor: keyBoardEvent.currentTarget });
        }
    }, []);

    /** Prevents rendering an empty menu bar when no configuration is provided. */
    if (config.length === 0) {
        return null;
    }

    return (
        <ThemeProvider theme={colorTheme === "dark" ? muiDarkTheme : muiLightTheme}>
            <CssBaseline />
            <AppBar
                position="static"
                sx={{
                    ...sx,
                    backgroundColor: "transparent",
                }}
                style={{
                    color: colorTheme === "dark" ? "rgb(255, 255, 255)" : "rgba(0, 0, 0, 0.87)",
                }}
                elevation={0}
            >
                <Toolbar
                    sx={{
                        padding: 0,
                        "&.MuiToolbar-root": {
                            minHeight: 0,
                            padding: 0,
                        },
                    }}
                >
                    {config.map((menuTopLevel, index) => (
                        <RenderMenuTopLevel
                            key={`menu-${index}-${menuTopLevel.label}`}
                            menuTopLevel={menuTopLevel}
                            menuTopLevelIndex={index}
                            openMenu={openMenu}
                            handleClick={handleClick}
                            handleKeyDown={handleKeyDown}
                            handleClose={handleClose}
                            colorTheme={colorTheme}
                        />
                    ))}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default MenuBar;