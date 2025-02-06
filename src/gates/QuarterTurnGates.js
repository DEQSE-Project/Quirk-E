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
import {Matrix} from "../math/Matrix.js"
import {Config} from "../Config.js"
import {GatePainting} from "../draw/GatePainting.js"

let QuarterTurnGates = {};

/** @type {!Gate} */
QuarterTurnGates.SqrtXForward = new GateBuilder().
    setSerializedIdAndSymbol('X^½').
    setTitle("√X Gate").
    setExportOptions("srn", "csrn").
    setBlurb("Principle square root of Not.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0.25, 0, 0)).
    setDrawer(args => {
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
    }).
    gate;

/** @type {!Gate} */
QuarterTurnGates.SqrtXBackward = new GateBuilder().
    setAlternate(QuarterTurnGates.SqrtXForward).
    setExportOptions("srndg", "crx", { theta: "-pi/2" }).
    setSerializedIdAndSymbol('X^-½').
    setTitle("X^-½ Gate").
    setBlurb("Adjoint square root of Not.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0.75, 0, 0)).
    setDrawer(args => {
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
    }).
    gate;

/** @type {!Gate} */
QuarterTurnGates.SqrtYForward = new GateBuilder().
    setSerializedIdAndSymbol('Y^½').
    setTitle("√Y Gate").
    setExportOptions("ry", "cry",  { theta: "pi/2" }, { theta: "pi/2" }).
    setBlurb("Principle square root of Y.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0.25, 0)).
    setDrawer(args => {
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
    }).
    gate;

/** @type {!Gate} */
QuarterTurnGates.SqrtYBackward = new GateBuilder().
    setAlternate(QuarterTurnGates.SqrtYForward).
    setSerializedIdAndSymbol('Y^-½').
    setTitle("Y^-½ Gate").
    setExportOptions("ry", "cry",  { theta: "-pi/2" }, { theta: "-pi/2" }).
    setBlurb("Adjoint square root of Y.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0.75, 0)).
    setDrawer(args => {
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
    }).
    gate;

/** @type {!Gate} */
QuarterTurnGates.SqrtZForward = new GateBuilder().
    setSerializedId('Z^½').
    setSymbol('S').
    setTitle("√Z Gate").
    setExportOptions("s", "cr2").
    setBlurb("Principle square root of Z.\nAlso known as the 'S' gate.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 0.25)).
    setDrawer(args => {
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
    }).
    gate;

/** @type {!Gate} */
QuarterTurnGates.SqrtZBackward = new GateBuilder().
    setAlternate(QuarterTurnGates.SqrtZForward).
    setSerializedId('Z^-½').
    setSymbol('S^-1').
    setExportOptions("sdg", "csdg").
    setTitle("Z^-½ Gate").
    setBlurb("Adjoint square root of Z.").
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 0.75)).
    setDrawer(args => {
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
    }).
    gate;

QuarterTurnGates.all = [
    QuarterTurnGates.SqrtXForward,
    QuarterTurnGates.SqrtYForward,
    QuarterTurnGates.SqrtZForward,
    QuarterTurnGates.SqrtXBackward,
    QuarterTurnGates.SqrtYBackward,
    QuarterTurnGates.SqrtZBackward
];

export {QuarterTurnGates}
