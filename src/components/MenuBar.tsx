/**
 * @fileoverview Implements the main MenuBar component, rendering a customizable
 * menu bar using Material-UI components and popup state management.
 */

import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { usePopupState, bindTrigger, bindPopover } from "material-ui-popup-state/hooks";
import CascadingMenu from "./CascadingMenu";
import { MenuBarProps, MenuConfig } from "../types";
import { useMenuHotkeys } from "../utils";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { MainMenuRenderer } from "./MainMenuRenderer";

export const MenuBar: React.FC<MenuBarProps> = ({
    config = [],
    color,
    sx,
    disableRipple,
}) => {
    const menuConfig = Array.isArray(config) ? config : [config];

    // Set up hotkeys for the menu items
    useMenuHotkeys(menuConfig);

    if (menuConfig.length === 0) {
        return (
            <AppBar position="static" elevation={0} color={color} sx={sx}>
                <Toolbar variant="dense" disableGutters={true} />
            </AppBar>
        );
    }

    return (
        <AppBar position="static" elevation={0} color={color} sx={{ 
            px: 0,
            minHeight: 0,
            '& .MuiToolbar-root': {
                minHeight: 0
            },
            ...sx 
        }}>
            <Toolbar variant="dense" disableGutters={true}>
                <MainMenuRenderer menuConfig={menuConfig} disableRipple={disableRipple} />
            </Toolbar>
        </AppBar>
    );
};

export default MenuBar;
