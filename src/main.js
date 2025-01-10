/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// It's important that the polyfills and error fallback get loaded first!
import {} from "./browser/Polyfills.js"
import {hookErrorHandler} from "./fallback.js"
hookErrorHandler();
import {doDetectIssues} from "./issues.js"
doDetectIssues();

import {CircuitStats} from "./circuit/CircuitStats.js"
import {CooldownThrottle} from "./base/CooldownThrottle.js"
import {Config} from "./Config.js"
import {DisplayedInspector} from "./ui/DisplayedInspector.js"
import {Painter} from "./draw/Painter.js"
import {Rect} from "./math/Rect.js"
import {RestartableRng} from "./base/RestartableRng.js"
import {Revision} from "./base/Revision.js"
import {initSerializer, fromJsonText_CircuitDefinition} from "./circuit/Serializer.js"
import {TouchScrollBlocker} from "./browser/TouchScrollBlocker.js"
import {Util} from "./base/Util.js"
import {initializedWglContext} from "./webgl/WglContext.js"
import {watchDrags, isMiddleClicking, eventPosRelativeTo} from "./browser/MouseWatcher.js"
import {ObservableValue, ObservableSource} from "./base/Obs.js"
import {ContextMenu} from "./ui/ContextMenu.js"
import {initExports, obsExportsIsShowing} from "./ui/exports.js"
import {initForge, obsForgeIsShowing} from "./ui/forge.js"
import {initGallery, obsGalleryIsShowing, closeGallery} from "./ui/circuits.js"
import {initUndoRedo} from "./ui/undo.js"
import {initClear} from "./ui/clear.js"
import {initUrlCircuitSync} from "./ui/url.js"
import {initTitleSync} from "./ui/title.js"
import {simulate} from "./ui/sim.js"
import {GatePainting} from "./draw/GatePainting.js"
import {GATE_CIRCUIT_DRAWER} from "./ui/DisplayedCircuit.js"
import {GateColumn} from "./circuit/GateColumn.js";
import {Point} from "./math/Point.js";
import {initImports} from "./ui/imports.js";

initSerializer(
    GatePainting.LABEL_DRAWER,
    GatePainting.MATRIX_DRAWER,
    GATE_CIRCUIT_DRAWER,
    GatePainting.LOCATION_INDEPENDENT_GATE_DRAWER);

const canvasDiv = document.getElementById("canvasDiv");

const defaultState = true; // `true` for colored, `false` for non-colored
const defaultStateForDarkMode = false;
const defaultStateForYellowMode = false;
const COLORED_UI_KEY = 'colored_ui';
const DARK_MODE_KEY = 'dark_mode';
const YELLOW_MODE_KEY = 'yellow_mode';

function getToggleState() {
    const storedState = localStorage.getItem(COLORED_UI_KEY);
    return storedState === null ? defaultState : storedState === 'true';
}

function getDarkModeToggleState() {
    const storedState = localStorage.getItem(DARK_MODE_KEY);
    return storedState === null ? defaultStateForDarkMode : storedState === 'true';
}

function getYellowModeToggleState() {
    const storedState = localStorage.getItem(YELLOW_MODE_KEY);
    return storedState === null ? defaultStateForYellowMode : storedState === 'true';
}

function setToggleState(isColored) {
    localStorage.setItem(COLORED_UI_KEY, isColored);
}

function setDarkModeToggleState(isDarkMode) {
    localStorage.setItem(DARK_MODE_KEY, isDarkMode);
}

function setYellowModeToggleState(isYellowMode) {
    localStorage.setItem(YELLOW_MODE_KEY, isYellowMode);
}

function applyToggleState() {
    const isColored = getToggleState();
    document.body.classList.toggle('colored-ui', isColored); // Example class toggling
    // Other rendering logic adjustments can go here
}

function applyDarkModeToggleState() {
    const isDarkMode = getDarkModeToggleState();
    document.body.classList.toggle('dark_mode', isDarkMode); // Example class toggling
    // Other rendering logic adjustments can go here
}

function applyYellowModeToggleState() {
    const isYellowMode = getYellowModeToggleState();
    document.body.classList.toggle('yellow_mode', isYellowMode); // Example class toggling
    // Other rendering logic adjustments can go here
}

function setupToggle() {
    const toggle = document.getElementById('ui-toggle');
    if (!toggle) return;

    // Initialize the toggle based on the current state
    toggle.checked = getToggleState();

    // Add event listener to handle state change
    toggle.addEventListener('change', (event) => {
        const isColored = event.target.checked;
        setToggleState(isColored);
        location.reload(); // Reload page to apply changes
    });
}

function setupDarkModeToggle() {
    const toggle = document.getElementById('darkmode-toggle');
    if (!toggle) return;

    // Initialize the toggle based on the current state
    toggle.checked = getDarkModeToggleState();

    // Add event listener to handle state change
    toggle.addEventListener('change', (event) => {
        const isDarkMode = event.target.checked;
        setDarkModeToggleState(isDarkMode);
        location.reload(); // Reload page to apply changes
    });
}

function setupYellowModeToggle() {
    const toggle = document.getElementById('yellow-mode-toggle');
    if (!toggle) return;

    // Initialize the toggle based on the current state
    toggle.checked = getYellowModeToggleState();

    // Add event listener to handle state change
    toggle.addEventListener('change', (event) => {
        const isYellowMode = event.target.checked;
        setYellowModeToggleState(isYellowMode);
        location.reload(); // Reload page to apply changes
    });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    applyToggleState();
    setupToggle();
});

document.addEventListener('DOMContentLoaded', () => {
    applyDarkModeToggleState();
    setupDarkModeToggle();
});

document.addEventListener('DOMContentLoaded', () => {
    applyYellowModeToggleState();
    setupYellowModeToggle();
});

//noinspection JSValidateTypes
/** @type {!HTMLCanvasElement} */
const canvas = document.getElementById("drawCanvas");
//noinspection JSValidateTypes
if (!canvas) {
    throw new Error("Couldn't find 'drawCanvas'");
}
canvas.width = canvasDiv.clientWidth;
canvas.height = window.innerHeight*0.9;
let haveLoaded = false;
const semiStableRng = (() => {
    const target = {cur: new RestartableRng()};
    let cycleRng;
    cycleRng = () => {
        target.cur = new RestartableRng();
        //noinspection DynamicallyGeneratedCodeJS
        setTimeout(cycleRng, Config.SEMI_STABLE_RANDOM_VALUE_LIFETIME_MILLIS*0.99);
    };
    cycleRng();
    return target;
})();

const exportJpgButton = document.getElementById('export-jpg-button');
exportJpgButton.addEventListener('click', () => {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        alert('Canvas element not found!');
        return;
    }

    let cur = syncArea(displayed.get());
    const toolboxHeight = 230;
    let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING + 30;
    let circuitAreaWidth = 0;
    if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
        circuitAreaWidth = 700;
        circuitAreaHeight = 150;
    }
    if(cur.displayedCircuit.circuitDefinition.numWires === 2 && cur.displayedCircuit.circuitDefinition.columns.length != 0) {
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 600;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 450;
        }
    }
    if(cur.displayedCircuit.circuitDefinition.numWires > 2) {
        circuitAreaHeight += 30;
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 800;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 650;
        }
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = circuitAreaWidth;
    offscreenCanvas.height = circuitAreaHeight;

    const offscreenContext = offscreenCanvas.getContext('2d');

    offscreenContext.drawImage(
        canvas, 
        0, toolboxHeight,             
        circuitAreaWidth, circuitAreaHeight, 
        0, 0,                        
        circuitAreaWidth, circuitAreaHeight 
    );

    const imageURL = offscreenCanvas.toDataURL('image/jpeg', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'quirk-e-circuit.jpg';
    downloadLink.click();
});

const exportPngButton = document.getElementById('export-png-button');
exportPngButton.addEventListener('click', () => {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        alert('Canvas element not found!');
        return;
    }

    let cur = syncArea(displayed.get());
    const toolboxHeight = 230;
    let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING + 30;
    let circuitAreaWidth = 0;
    if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
        circuitAreaWidth = 300;
        circuitAreaHeight = 200;
    }
    if(cur.displayedCircuit.circuitDefinition.numWires === 2) {
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 600;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 450;
        }
    }
    if(cur.displayedCircuit.circuitDefinition.numWires > 2) {
        circuitAreaHeight += 30;
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 800;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 650;
        }
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = circuitAreaWidth;
    offscreenCanvas.height = circuitAreaHeight;

    const offscreenContext = offscreenCanvas.getContext('2d');

    offscreenContext.drawImage(
        canvas, 
        0, toolboxHeight,            
        circuitAreaWidth, circuitAreaHeight, 
        0, 0,                      
        circuitAreaWidth, circuitAreaHeight 
    );

    const imageURL = offscreenCanvas.toDataURL('image/png', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'quirk-e-circuit.png';
    downloadLink.click();
});

const exportWebpButton = document.getElementById('export-webp-button');
exportWebpButton.addEventListener('click', () => {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        alert('Canvas element not found!');
        return;
    }

    let cur = syncArea(displayed.get());
    const toolboxHeight = 230;
    let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING + 30;
    let circuitAreaWidth = 0;
    if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
        circuitAreaWidth = 300;
        circuitAreaHeight = 200;
    }
    if(cur.displayedCircuit.circuitDefinition.numWires === 2) {
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 600;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 450;
        }
    }
    if(cur.displayedCircuit.circuitDefinition.numWires > 2) {
        circuitAreaHeight += 30;
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 800;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 650;
        }
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = circuitAreaWidth;
    offscreenCanvas.height = circuitAreaHeight;

    const offscreenContext = offscreenCanvas.getContext('2d');

    offscreenContext.drawImage(
        canvas, 
        0, toolboxHeight,            
        circuitAreaWidth, circuitAreaHeight, 
        0, 0,                         
        circuitAreaWidth, circuitAreaHeight
    );

    const imageURL = offscreenCanvas.toDataURL('image/webp', 1.0);
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = 'quirk-e-circuit.webp';
    downloadLink.click();
});

const exportSvgButton = document.getElementById('export-svg-button');
exportSvgButton.addEventListener('click', () => {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        alert('Canvas element not found!');
        return;
    }

    let cur = syncArea(displayed.get());
    const toolboxHeight = 230;
    let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING + 30;
    let circuitAreaWidth = 0;
    if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
        circuitAreaWidth = 300;
        circuitAreaHeight = 200;
    }
    if(cur.displayedCircuit.circuitDefinition.numWires === 2) {
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 600;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 450;
        }
    }
    if(cur.displayedCircuit.circuitDefinition.numWires > 2) {
        circuitAreaHeight += 30;
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 800;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 650;
        }
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = circuitAreaWidth;
    offscreenCanvas.height = circuitAreaHeight;

    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenContext.drawImage(
        canvas,
        0, toolboxHeight,        
        circuitAreaWidth, circuitAreaHeight, 
        0, 0,                        
        circuitAreaWidth, circuitAreaHeight 
    );

    const imageData = offscreenCanvas.toDataURL('image/png');

    const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${circuitAreaWidth}" height="${circuitAreaHeight}">
            <image href="${imageData}" width="${circuitAreaWidth}" height="${circuitAreaHeight}" />
        </svg>
    `;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'quirk-e-circuit.svg';
    downloadLink.click();
});

const exportPdfButton = document.getElementById('export-pdf-button');
exportPdfButton.addEventListener('click', () => {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        alert('Canvas element not found!');
        return;
    }

    let cur = syncArea(displayed.get());
    const toolboxHeight = 230;
    let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING + 30;
    let circuitAreaWidth = 0;
    if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
        circuitAreaWidth = 300;
        circuitAreaHeight = 200;
    }
    if(cur.displayedCircuit.circuitDefinition.numWires === 2) {
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 600;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 450;
        }
    }
    if(cur.displayedCircuit.circuitDefinition.numWires > 2) {
        circuitAreaHeight += 30;
        if(cur.displayedCircuit.circuitDefinition.columns.length <= 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 800;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length > 3) {
            circuitAreaWidth = cur.displayedCircuit.circuitDefinition.columns.length * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + 650;
        }
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = circuitAreaWidth;
    offscreenCanvas.height = circuitAreaHeight;

    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenContext.drawImage(
        canvas,
        0, toolboxHeight, 
        circuitAreaWidth, circuitAreaHeight,
        0, 0, 
        circuitAreaWidth, circuitAreaHeight
    );

    const imgData = offscreenCanvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf; 
    const pdf = new jsPDF('landscape', 'px', [circuitAreaWidth, circuitAreaHeight]);
    pdf.addImage(imgData, 'PNG', 0, 0, circuitAreaWidth, circuitAreaHeight);
    pdf.save('quirk-e-circuit.pdf'); 
});

//noinspection JSValidateTypes
/** @type {!HTMLDivElement} */
const inspectorDiv = document.getElementById("inspectorDiv");

/** @type {ObservableValue.<!DisplayedInspector>} */
const displayed = new ObservableValue(
    DisplayedInspector.empty(new Rect(0, 0, canvas.clientWidth, canvas.clientHeight)));
const mostRecentStats = new ObservableValue(CircuitStats.EMPTY);
/** @type {!Revision} */
let revision = Revision.startingAt(displayed.get().snapshot());

revision.latestActiveCommit().subscribe(jsonText => {
    let circuitDef = fromJsonText_CircuitDefinition(jsonText);
    let newInspector = displayed.get().withCircuitDefinition(circuitDef);
    displayed.set(newInspector);
});

/**
 * @param {!DisplayedInspector} curInspector
 * @returns {{w: number, h: !number}}
 */
let desiredCanvasSizeFor = curInspector => {
    return {
        w: Math.max(canvasDiv.clientWidth, curInspector.desiredWidth()),
        h: curInspector.desiredHeight()
    };
};

/**
 * @param {!DisplayedInspector} ins
 * @returns {!DisplayedInspector}
 */
const syncArea = ins => {
    let size = desiredCanvasSizeFor(ins);
    ins.updateArea(new Rect(0, 0, size.w, size.h));
    return ins;
};

// Gradually fade out old errors as user manipulates circuit.
displayed.observable().
    map(e => e.displayedCircuit.circuitDefinition).
    whenDifferent(Util.CUSTOM_IS_EQUAL_TO_EQUALITY).
    subscribe(() => {
        let errDivStyle = document.getElementById('error-div').style;
        errDivStyle.opacity *= 0.9;
        if (errDivStyle.opacity < 0.06) {
            errDivStyle.display = 'None'
        }
    });

/** @type {!CooldownThrottle} */
let redrawThrottle;
const scrollBlocker = new TouchScrollBlocker(canvasDiv);
const redrawNow = () => {
    if (!haveLoaded) {
        // Don't draw while loading. It's a huge source of false-positive circuit-load-failed errors during development.
        return;
    }

    let shown = syncArea(displayed.get()).previewDrop();
    if (displayed.get().hand.isHoldingSomething() && !shown.hand.isHoldingSomething()) {
        shown = shown.withHand(shown.hand.withHeldGateColumn(new GateColumn([]), new Point(0, 0)))
    }
    let stats = simulate(shown.displayedCircuit.circuitDefinition);
    mostRecentStats.set(stats);

    let size = desiredCanvasSizeFor(shown);
    canvas.width = size.w;
    canvas.height = size.h;
    let painter = new Painter(canvas, semiStableRng.cur.restarted());
    shown.updateArea(painter.paintableArea());
    shown.paint(painter, stats);
    painter.paintDeferred();

    displayed.get().hand.paintCursor(painter);
    scrollBlocker.setBlockers(painter.touchBlockers, painter.desiredCursorStyle);
    canvas.style.cursor = painter.desiredCursorStyle || 'auto';

    let dt = displayed.get().stableDuration();
    if (dt < Infinity) {
        window.requestAnimationFrame(() => redrawThrottle.trigger());
    }
};

redrawThrottle = new CooldownThrottle(redrawNow, Config.REDRAW_COOLDOWN_MILLIS, 0.1, true);
window.addEventListener('resize', () => redrawThrottle.trigger(), false);
displayed.observable().subscribe(() => redrawThrottle.trigger());

/** @type {undefined|!string} */
let clickDownGateButtonKey = undefined;
canvasDiv.addEventListener('click', ev => {
    let pt = eventPosRelativeTo(ev, canvasDiv);
    let curInspector = displayed.get();
    if (curInspector.tryGetHandOverButtonKey() !== clickDownGateButtonKey) {
        return;
    }
    let clicked = syncArea(curInspector.withHand(curInspector.hand.withPos(pt))).tryClick();
    if (clicked !== undefined) {
        revision.commit(clicked.afterTidyingUp().snapshot());
    }
});

const contextMenu = new ContextMenu(displayed, revision, syncArea);
canvasDiv.addEventListener("contextmenu", ev => {
    // TODO: once selecting multiple gates becomes a thing
    // this needs to be changed to prioritize that.
    let curInspector = displayed.get();
    let point = curInspector.isGateOverlappingHand();
    if(point) {
        ev.preventDefault();
        contextMenu.open(point);
    }
});

watchDrags(canvasDiv,
    /**
     * Grab
     * @param {!Point} pt
     * @param {!MouseEvent|!TouchEvent} ev
     */
    (pt, ev) => {
        let oldInspector = displayed.get();
        let newHand = oldInspector.hand.withPos(pt);
        let newInspector = syncArea(oldInspector.withHand(newHand));
        clickDownGateButtonKey = (
            ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey ? undefined : newInspector.tryGetHandOverButtonKey());
        if (clickDownGateButtonKey !== undefined) {
            displayed.set(newInspector);
            return;
        }

        newInspector = newInspector.afterGrabbing(ev.shiftKey, ev.ctrlKey || ev.metaKey);
        if (displayed.get().isEqualTo(newInspector) || !newInspector.hand.isBusy()) {
            return;
        }

        // Add extra wire temporarily.
        revision.startedWorkingOnCommit();
        displayed.set(
            syncArea(oldInspector.withHand(newHand).withJustEnoughWires(newInspector.hand, 1)).
                afterGrabbing(ev.shiftKey, ev.ctrlKey || ev.metaKey, false, ev.altKey));

        ev.preventDefault();
    },
    /**
     * Cancel
     * @param {!MouseEvent|!TouchEvent} ev
     */
    ev => {
        revision.cancelCommitBeingWorkedOn();
        ev.preventDefault();
    },
    /**
     * Drag
     * @param {undefined|!Point} pt
     * @param {!MouseEvent|!TouchEvent} ev
     */
    (pt, ev) => {
        if (!displayed.get().hand.isBusy()) {
            return;
        }

        let newHand = displayed.get().hand.withPos(pt);
        let newInspector = displayed.get().withHand(newHand);
        displayed.set(newInspector);
        ev.preventDefault();
    },
    /**
     * Drop
     * @param {undefined|!Point} pt
     * @param {!MouseEvent|!TouchEvent} ev
     */
    (pt, ev) => {
        if (!displayed.get().hand.isBusy()) {
            return;
        }

        let newHand = displayed.get().hand.withPos(pt);
        let newInspector = syncArea(displayed.get()).withHand(newHand).afterDropping().afterTidyingUp();
        let clearHand = newInspector.hand.withPos(undefined);
        let clearInspector = newInspector.withJustEnoughWires(clearHand, 0);
        revision.commit(clearInspector.snapshot());
        ev.preventDefault();
    });

// Middle-click to delete a gate.
canvasDiv.addEventListener('mousedown', ev => {
    contextMenu.close();

    if (!isMiddleClicking(ev)) {
        return;
    }
    let cur = syncArea(displayed.get());
    let initOver = cur.tryGetHandOverButtonKey();
    let newHand = cur.hand.withPos(eventPosRelativeTo(ev, canvas));
    let newInspector;
    if (initOver !== undefined && initOver.startsWith('wire-init-')) {
        let newCircuit = cur.displayedCircuit.circuitDefinition.withSwitchedInitialStateOn(
            parseInt(initOver.substr(10)), 0);
        newInspector = cur.withCircuitDefinition(newCircuit).withHand(newHand).afterTidyingUp();
    } else {
        newInspector = cur.
            withHand(newHand).
            afterGrabbing(false, false, true, false). // Grab the gate.
            withHand(newHand). // Lose the gate.
            afterTidyingUp().
            withJustEnoughWires(newHand, 0);
    }
    if (!displayed.get().isEqualTo(newInspector)) {
        revision.commit(newInspector.snapshot());
        ev.preventDefault();
    }
});

// When mouse moves without dragging, track it (for showing hints and things).
canvasDiv.addEventListener('mousemove', ev => {
    if (!displayed.get().hand.isBusy()) {
        let newHand = displayed.get().hand.withPos(eventPosRelativeTo(ev, canvas));
        let newInspector = displayed.get().withHand(newHand);
        displayed.set(newInspector);
    }
});
canvasDiv.addEventListener('mouseleave', () => {
    if (!displayed.get().hand.isBusy()) {
        let newHand = displayed.get().hand.withPos(undefined);
        let newInspector = displayed.get().withHand(newHand);
        displayed.set(newInspector);
    }
});

let obsIsAnyOverlayShowing = new ObservableSource();
initUrlCircuitSync(revision);
initExports(revision, mostRecentStats, obsIsAnyOverlayShowing.observable());
initImports(revision, mostRecentStats, obsIsAnyOverlayShowing.observable());
initForge(revision, obsIsAnyOverlayShowing.observable());
initUndoRedo(revision, obsIsAnyOverlayShowing.observable());
initClear(revision, obsIsAnyOverlayShowing.observable());
initGallery(revision, obsIsAnyOverlayShowing.observable());
initTitleSync(revision);
obsForgeIsShowing.
    zipLatest(obsExportsIsShowing, (e1, e2) => e1 || e2).
    zipLatest(obsGalleryIsShowing, (e1, e2) => e1 || e2).
    whenDifferent().
    subscribe(e => {
        obsIsAnyOverlayShowing.send(e);
        canvasDiv.tabIndex = e ? -1 : 0;
    });

// If the webgl initialization is going to fail, don't fail during the module loading phase.
haveLoaded = true;
setTimeout(() => {
    inspectorDiv.style.display = 'block';
    redrawNow();
    document.getElementById("close-circuits-button").style.display = 'block';
    closeGallery();

    try {
        initializedWglContext().onContextRestored = () => redrawThrottle.trigger();
    } catch (ex) {
        // If that failed, the user is already getting warnings about WebGL not being supported.
        // Just silently log it.
        console.error(ex);
    }
}, 0);
