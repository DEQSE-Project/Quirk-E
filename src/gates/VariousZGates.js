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

let VariousZGates = {};

VariousZGates.Z3 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅓").
    setTitle("Z^⅓ Gate").
    setBlurb("Principle third root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 6)).
    gate;

VariousZGates.Z3i = new GateBuilder().
    setSerializedIdAndSymbol("Z^-⅓").
    setTitle("Z^-⅓ Gate").
    setBlurb("Adjoint third root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, -1 / 6)).
    setAlternate(VariousZGates.Z3).
    gate;

VariousZGates.Z4 = new GateBuilder().
    setSerializedIdAndSymbol("Z^¼").
    setTitle("Z^¼ Gate").
    setBlurb("Principle fourth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 8)).
    gate;

VariousZGates.Z4i = new GateBuilder().
    setSerializedIdAndSymbol("Z^-¼").
    setTitle("Z^-¼ Gate").
    setBlurb("Adjoint fourth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, -1 / 8)).
    setAlternate(VariousZGates.Z4).
    gate;

VariousZGates.Z8 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅛").
    setTitle("Z^⅛ Gate").
    setBlurb("Principle eighth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 16)).
    gate;

VariousZGates.Z8i = new GateBuilder().
    setSerializedIdAndSymbol("Z^-⅛").
    setTitle("Z^-⅛ Gate").
    setBlurb("Adjoint eighth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, -1 / 16)).
    setAlternate(VariousZGates.Z8).
    gate;

VariousZGates.Z16 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅟₁₆").
    setTitle("Z^⅟₁₆ Gate").
    setBlurb("Principle sixteenth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 32)).
    gate;

VariousZGates.Z16i = new GateBuilder().
    setSerializedIdAndSymbol("Z^-⅟₁₆").
    setTitle("Z^-⅟₁₆ Gate").
    setBlurb("Adjoint sixteenth root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, -1 / 32)).
    setAlternate(VariousZGates.Z16).
    gate;

VariousZGates.Z32 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅟₃₂").
    setTitle("Z^⅟₃₂ Gate").
    setBlurb("Principle 32'nd root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 64)).
    gate;

VariousZGates.Z64 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅟₆₄").
    setTitle("Z^⅟₆₄ Gate").
    setBlurb("Principle 64'th root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 128)).
    gate;

VariousZGates.Z128 = new GateBuilder().
    setSerializedIdAndSymbol("Z^⅟₁₂₈").
    setTitle("Z^⅟₁₂₈ Gate").
    setBlurb("Principle 128'th root of Z.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.ROTATION_AND_TURNS_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        if (!args.isInToolbox) {
            GatePainting.paintCycleState(args, args.stats.time * 2 * Math.PI * 1, 0, 0, 1);
        }
    }).
    setKnownEffectToMatrix(Matrix.fromPauliRotation(0, 0, 1 / 256)).
    gate;


VariousZGates.all =[
    VariousZGates.Z3,
    VariousZGates.Z4,
    VariousZGates.Z8,
    VariousZGates.Z16,
    VariousZGates.Z32,
    VariousZGates.Z64,
    VariousZGates.Z128,
    VariousZGates.Z3i,
    VariousZGates.Z4i,
    VariousZGates.Z8i,
    VariousZGates.Z16i
];

export {VariousZGates}
