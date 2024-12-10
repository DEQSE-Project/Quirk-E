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

let VariousYGates = {};

VariousYGates.Y3 = new GateBuilder().
    setSerializedIdAndSymbol("Y^⅓").
    setTitle("Y^⅓ Gate").
    setBlurb("Principle third root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 1 / 6, 0)).
    gate;

VariousYGates.Y3i = new GateBuilder().
    setSerializedIdAndSymbol("Y^-⅓").
    setTitle("Y^-⅓ Gate").
    setBlurb("Adjoint third root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, -1 / 6, 0)).
    setAlternate(VariousYGates.Y3).
    gate;

VariousYGates.Y4 = new GateBuilder().
    setSerializedIdAndSymbol("Y^¼").
    setTitle("Y^¼ Gate").
    setBlurb("Principle fourth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 1 / 8, 0)).
    gate;

VariousYGates.Y4i = new GateBuilder().
    setSerializedIdAndSymbol("Y^-¼").
    setTitle("Y^-¼ Gate").
    setBlurb("Adjoint fourth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, -1 / 8, 0)).
    setAlternate(VariousYGates.Y4).
    gate;

VariousYGates.Y8 = new GateBuilder().
    setSerializedIdAndSymbol("Y^⅛").
    setTitle("Y^⅛ Gate").
    setBlurb("Principle eighth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 1 / 16, 0)).
    gate;

VariousYGates.Y8i = new GateBuilder().
    setSerializedIdAndSymbol("Y^-⅛").
    setTitle("Y^-⅛ Gate").
    setBlurb("Adjoint eighth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, -1 / 16, 0)).
    setAlternate(VariousYGates.Y8).
    gate;

VariousYGates.Y16 = new GateBuilder().
    setSerializedIdAndSymbol("Y^⅟₁₆").
    setTitle("Y^⅟₁₆ Gate").
    setBlurb("Principle sixteenth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 1 / 32, 0)).
    gate;

VariousYGates.Y16i = new GateBuilder().
    setSerializedIdAndSymbol("Y^-⅟₁₆").
    setTitle("Y^-⅟₁₆ Gate").
    setBlurb("Adjoint sixteenth root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, -1 / 32, 0)).
    setAlternate(VariousYGates.Y16).
    gate;

VariousYGates.Y32 = new GateBuilder().
    setSerializedIdAndSymbol("Y^⅟₃₂").
    setTitle("Y^⅟₃₂ Gate").
    setBlurb("Principle 32'nd root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 1 / 64, 0)).
    gate;

VariousYGates.Y32i = new GateBuilder().
    setSerializedIdAndSymbol("Y^-⅟₃₂").
    setTitle("Y^-⅟₃₂ Gate").
    setBlurb("Adjoint 32'nd root of Y.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 1, 0, 0);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, -1 / 64, 0)).
    setAlternate(VariousYGates.Y32).
    gate;

VariousYGates.all =[
    VariousYGates.Y3,
    VariousYGates.Y4,
    VariousYGates.Y8,
    VariousYGates.Y16,
    VariousYGates.Y32,
    VariousYGates.Y3i,
    VariousYGates.Y4i,
    VariousYGates.Y8i,
    VariousYGates.Y16i,
    VariousYGates.Y32i
];

export {VariousYGates}
