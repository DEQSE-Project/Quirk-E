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

import {GateBuilder} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Matrix} from "../math/Matrix.js"
import {Config} from "../Config.js"

let VariousXGates = {};

VariousXGates.X3 = new GateBuilder().
    setSerializedIdAndSymbol("X^⅓").
    setTitle("X^⅓ Gate").
    setBlurb("Principle third root of X.").
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
    setKnownEffectToMatrix(Matrix.fromPauliRotation(1 / 6, 0, 0))
    .gate;
VariousXGates.X3i = new GateBuilder().
    setSerializedIdAndSymbol("X^-⅓").
    setTitle("X^-⅓ Gate").
    setBlurb("Adjoint third root of X.").
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
    setKnownEffectToMatrix(Matrix.fromPauliRotation(-1 / 6, 0, 0)).
    setAlternate(VariousXGates.X3)
    .gate;
    VariousXGates.X4 = new GateBuilder().
    setSerializedIdAndSymbol("X^¼").
    setTitle("X^¼ Gate").
    setExportOptions("rx", "crx", { theta: "pi/4"}, { theta: "pi/4" }).
    setBlurb("Principle fourth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(1 / 8, 0, 0)).
    gate;

VariousXGates.X4i = new GateBuilder().
    setSerializedIdAndSymbol("X^-¼").
    setExportOptions("rx", "crx", { theta: "-pi/4"}, { theta: "-pi/4" }).
    setTitle("X^-¼ Gate").
    setBlurb("Adjoint fourth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(-1 / 8, 0, 0)).
    setAlternate(VariousXGates.X4).
    gate;

VariousXGates.X8 = new GateBuilder().
    setSerializedIdAndSymbol("X^⅛").
    setTitle("X^⅛ Gate").
    setBlurb("Principle eighth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(1 / 16, 0, 0)).
    gate;

VariousXGates.X8i = new GateBuilder().
    setSerializedIdAndSymbol("X^-⅛").
    setTitle("X^-⅛ Gate").
    setBlurb("Adjoint eighth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(-1 / 16, 0, 0)).
    setAlternate(VariousXGates.X8).
    gate;

VariousXGates.X16 = new GateBuilder().
    setSerializedIdAndSymbol("X^⅟₁₆").
    setTitle("X^⅟₁₆ Gate").
    setBlurb("Principle sixteenth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(1 / 32, 0, 0)).
    gate;

VariousXGates.X16i = new GateBuilder().
    setSerializedIdAndSymbol("X^-⅟₁₆").
    setTitle("X^-⅟₁₆ Gate").
    setBlurb("Adjoint sixteenth root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(-1 / 32, 0, 0)).
    setAlternate(VariousXGates.X16).
    gate;

VariousXGates.X32 = new GateBuilder().
    setSerializedIdAndSymbol("X^⅟₃₂").
    setTitle("X^⅟₃₂ Gate").
    setBlurb("Principle 32'nd root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(1 / 64, 0, 0)).
    gate;

VariousXGates.X32i = new GateBuilder().
    setSerializedIdAndSymbol("X^-⅟₃₂").
    setTitle("X^-⅟₃₂ Gate").
    setBlurb("Adjoint 32'nd root of X.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.ROTATION_AND_TURNS_COLOR;
        let usedHighlight = Config.ROTATION_AND_TURNS_HIGHLIGHT;
        if (isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighlight = Config.YELLOW_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighlight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(-1 / 64, 0, 0)).
    setAlternate(VariousXGates.X32).
    gate;


VariousXGates.all =[
    VariousXGates.X3,
    VariousXGates.X4,
    VariousXGates.X8,
    VariousXGates.X16,
    VariousXGates.X32,
    VariousXGates.X3i,
    VariousXGates.X4i,
    VariousXGates.X8i,
    VariousXGates.X16i,
    VariousXGates.X32i,
];

export {VariousXGates}
