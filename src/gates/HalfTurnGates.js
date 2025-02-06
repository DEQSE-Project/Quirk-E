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

import {Gate, GateBuilder} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Matrix} from "../math/Matrix.js"
import {Point} from "../math/Point.js"
import {ketArgs, ketShader, ketShaderPermute} from "../circuit/KetShaderUtil.js"
import {Config} from "../Config.js"

/**
 * Gates that correspond to 180 degree rotations around the Bloch sphere, so they're their own inverses.
 */
let HalfTurnGates = {};

/**
 * The X gate is drawn as a crossed circle when it has controls.
 * @param {!GateDrawParams} args
 */
function NOT_DRAWER(args) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.ROTATION_AND_TURNS_COLOR;
    let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
    if (isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighlight = Config.YELLOW_HIGHLIGHT;
    }
    if(args.isHighlighted) {
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        return;
    }
    // Show a box around the operation when it's not in the circuit.
    if (args.positionInCircuit === undefined) {
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        return;
    }

    let drawArea = args.rect.scaledOutwardBy(0.6);
    args.painter.fillCircle(drawArea.center(), drawArea.w / 2);
    args.painter.strokeCircle(drawArea.center(), drawArea.w / 2);

    // Vertical stroke(s).
    let hasSingleWireControl =
        args.positionInCircuit !== undefined &&
        args.stats.circuitDefinition.colHasSingleWireControl(args.positionInCircuit.col);
    let hasDoubleWireControl =
        args.positionInCircuit !== undefined &&
        args.stats.circuitDefinition.colHasDoubleWireControl(args.positionInCircuit.col);
    if (hasSingleWireControl || !hasDoubleWireControl) {
        args.painter.strokeLine(drawArea.topCenter(), drawArea.bottomCenter());
    }
    if (hasDoubleWireControl) {
        args.painter.strokeLine(drawArea.topCenter().offsetBy(-1, 0), drawArea.bottomCenter().offsetBy(-1, 0));
        args.painter.strokeLine(drawArea.topCenter().offsetBy(+1, 0), drawArea.bottomCenter().offsetBy(+1, 0));
    }

    // Horizontal stroke(s).
    let isMeasured = args.positionInCircuit !== undefined && args.stats.circuitDefinition.locIsMeasured(
        new Point(args.positionInCircuit.col, args.positionInCircuit.row));
    if (isMeasured) {
        args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, -1), drawArea.centerRight().offsetBy(0, -1));
        args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, +1), drawArea.centerRight().offsetBy(0, +1));
    } else {
        args.painter.strokeLine(drawArea.centerLeft(), drawArea.centerRight());
    }
}

let xShader = ketShaderPermute('', 'return 1.0-out_id;', 1);
/** @type {!Gate} */
HalfTurnGates.X = new GateBuilder().
    setSerializedIdAndSymbol("X").
    setTitle("Pauli X Gate").
    setExportOptions("x", "cx").
    setBlurb("The NOT gate.\nToggles between ON and OFF.").
    setActualEffectToShaderProvider(ctx => xShader.withArgs(...ketArgs(ctx))).
    setKnownEffectToMatrix(Matrix.PAULI_X).
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        if(args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintGateSymbol(args);
            args.painter.strokeRect(args.rect, 'black');
            return;
        }
        // Show a box around the operation when it's not in the circuit.
        if (args.positionInCircuit === undefined) {
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeRect(args.rect, 'black');
            let drawArea = args.rect.scaledOutwardBy(0.6);
            args.painter.fillCircle(drawArea.center(), drawArea.w / 2, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeCircle(drawArea.center(), drawArea.w / 2);
        
            // Vertical stroke(s).
            let hasSingleWireControl =
                args.positionInCircuit !== undefined &&
                args.stats.circuitDefinition.colHasSingleWireControl(args.positionInCircuit.col);
            let hasDoubleWireControl =
                args.positionInCircuit !== undefined &&
                args.stats.circuitDefinition.colHasDoubleWireControl(args.positionInCircuit.col);
            if (hasSingleWireControl || !hasDoubleWireControl) {
                args.painter.strokeLine(drawArea.topCenter(), drawArea.bottomCenter());
            }
            if (hasDoubleWireControl) {
                args.painter.strokeLine(drawArea.topCenter().offsetBy(-1, 0), drawArea.bottomCenter().offsetBy(-1, 0));
                args.painter.strokeLine(drawArea.topCenter().offsetBy(+1, 0), drawArea.bottomCenter().offsetBy(+1, 0));
            }
        
            // Horizontal stroke(s).
            let isMeasured = args.positionInCircuit !== undefined && args.stats.circuitDefinition.locIsMeasured(
                new Point(args.positionInCircuit.col, args.positionInCircuit.row));
            if (isMeasured) {
                args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, -1), drawArea.centerRight().offsetBy(0, -1));
                args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, +1), drawArea.centerRight().offsetBy(0, +1));
            } else {
                args.painter.strokeLine(drawArea.centerLeft(), drawArea.centerRight());
            }
        }
        else if (args.positionInCircuit !== undefined) {
            let drawArea = args.rect.scaledOutwardBy(0.6);
            args.painter.fillCircle(drawArea.center(), drawArea.w / 2, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
            args.painter.strokeCircle(drawArea.center(), drawArea.w / 2);
        
            // Vertical stroke(s).
            let hasSingleWireControl =
                args.positionInCircuit !== undefined &&
                args.stats.circuitDefinition.colHasSingleWireControl(args.positionInCircuit.col);
            let hasDoubleWireControl =
                args.positionInCircuit !== undefined &&
                args.stats.circuitDefinition.colHasDoubleWireControl(args.positionInCircuit.col);
            if (hasSingleWireControl || !hasDoubleWireControl) {
                args.painter.strokeLine(drawArea.topCenter(), drawArea.bottomCenter());
            }
            if (hasDoubleWireControl) {
                args.painter.strokeLine(drawArea.topCenter().offsetBy(-1, 0), drawArea.bottomCenter().offsetBy(-1, 0));
                args.painter.strokeLine(drawArea.topCenter().offsetBy(+1, 0), drawArea.bottomCenter().offsetBy(+1, 0));
            }
        
            // Horizontal stroke(s).
            let isMeasured = args.positionInCircuit !== undefined && args.stats.circuitDefinition.locIsMeasured(
                new Point(args.positionInCircuit.col, args.positionInCircuit.row));
            if (isMeasured) {
                args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, -1), drawArea.centerRight().offsetBy(0, -1));
                args.painter.strokeLine(drawArea.centerLeft().offsetBy(0, +1), drawArea.centerRight().offsetBy(0, +1));
            } else {
                args.painter.strokeLine(drawArea.centerLeft(), drawArea.centerRight());
            }
        }
    }).
    gate;

function DRAW_GATE (args) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.ROTATION_AND_TURNS_COLOR;
    let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
    if (isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighlight = Config.YELLOW_HIGHLIGHT;
    }
    // Fill the gate with the configured fill color
    args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);

    // Highlight the gate if needed (when `args.isHighlighted` is true)
    if (args.isHighlighted) {
        args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
    }
    GatePainting.paintGateSymbol(args);
    args.painter.strokeRect(args.rect, 'black');
}

let yShader = ketShader('', 'vec2 v = inp(1.0-out_id); return (out_id*2.0 - 1.0)*vec2(-v.y, v.x);', 1);
/** @type {!Gate} */
HalfTurnGates.Y = new GateBuilder().
    setSerializedIdAndSymbol("Y").
    setTitle("Pauli Y Gate").
    setExportOptions("y", "cy").
    setBlurb("A combination of the X and Z gates.").
    setActualEffectToShaderProvider(ctx => yShader.withArgs(...ketArgs(ctx))).
    setKnownEffectToMatrix(Matrix.PAULI_Y).
    setDrawer(args => DRAW_GATE(args)).
    gate;

let zShader = ketShader('', 'return amp*(1.0 - out_id*2.0);', 1);
/** @type {!Gate} */
HalfTurnGates.Z = new GateBuilder().
    setSerializedIdAndSymbol("Z").
    setTitle("Pauli Z Gate").
    setExportOptions("z", "cz").
    setBlurb("The phase flip gate.\nNegates phases when the qubit is ON.").
    setActualEffectToShaderProvider(ctx => zShader.withArgs(...ketArgs(ctx))).
    setKnownEffectToMatrix(Matrix.PAULI_Z).
    setDrawer(args => DRAW_GATE(args)).
    gate;

let hShader = ketShader('', 'return 0.7071067811865476*(amp*(1.0-2.0*out_id) + inp(1.0-out_id));', 1);
/** @type {!Gate} */
HalfTurnGates.H = new GateBuilder().
    setSerializedIdAndSymbol("H").
    setTitle("Hadamard Gate").
    setExportOptions("h", "ch").
    setBlurb("Creates simple superpositions.\n" +
        "Maps ON to ON + OFF.\n" +
        "Maps OFF to ON - OFF.").
    setActualEffectToShaderProvider(ctx => hShader.withArgs(...ketArgs(ctx))).
    setKnownEffectToMatrix(Matrix.HADAMARD).
    setDrawer(args => DRAW_GATE(args)).
    gate;

HalfTurnGates.all = [
    HalfTurnGates.X,
    HalfTurnGates.Y,
    HalfTurnGates.Z,
    HalfTurnGates.H
];

export {HalfTurnGates}
