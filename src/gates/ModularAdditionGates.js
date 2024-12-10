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

import {Gate} from "../circuit/Gate.js"
import {ketArgs, ketShaderPermute, ketInputGateShaderCode} from "../circuit/KetShaderUtil.js"
import {Util} from "../base/Util.js"
import {WglArg} from "../webgl/WglArg.js"
import {modulusTooBigChecker} from "./ModularIncrementGates.js"
import {Config} from "../Config.js"
import {GatePainting} from "../draw/GatePainting.js"

let ModularAdditionGates = {};

const MODULAR_ADDITION_SHADER = ketShaderPermute(
    `
        uniform float factor;
        ${ketInputGateShaderCode('A')}
        ${ketInputGateShaderCode('R')}
    `,
    `
        float r = read_input_R();
        if (out_id >= r) {
            return out_id;
        }
        float d = read_input_A();
        d *= factor;
        d = floor(mod(d + 0.5, r));
        return floor(mod(out_id + r - d + 0.5, r));
    `);

function DRAW_GATE (args) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.MATH_COLOR;
    let usedHighLight = Config.MATH_HIGHLIGHT;
    if(isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighLight = Config.YELLOW_HIGHLIGHT;
    }
    if (args.isInToolbox) {
        // Fill the gate with the configured fill color
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        
        // Highlight the gate if needed (when `args.isHighlighted` is true)
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }

        args.painter.strokeRect(args.rect, 'black');
        GatePainting.paintGateSymbol(args);
    }
    else {
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        args.painter.strokeRect(args.rect);
        GatePainting.paintResizeTab(args);
        GatePainting.paintGateSymbol(args);
    }
}

ModularAdditionGates.PlusAModRFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("+AmodR" + span).
    setSymbol("+A\nmod R").
    setTitle("Modular Addition Gate").
    setBlurb("Adds input A into the target, mod input R.\nOnly affects values below R.").
    setRequiredContextKeys("Input Range A", "Input Range R").
    setExtraDisableReasonFinder(modulusTooBigChecker("R", span)).
    setActualEffectToShaderProvider(ctx => MODULAR_ADDITION_SHADER.withArgs(
        ...ketArgs(ctx, span, ['A', 'R']),
        WglArg.float("factor", +1))).
    setKnownEffectToParametrizedPermutation((t, a, r) => t < r ? (t + a) % r : t).
    setDrawer(args => DRAW_GATE(args)));

ModularAdditionGates.MinusAModRFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setAlternateFromFamily(ModularAdditionGates.PlusAModRFamily).
    setSerializedId("-AmodR" + span).
    setSymbol("−A\nmod R").
    setTitle("Modular Subtraction Gate").
    setBlurb("Subtracts input A out of the target, mod input R.\nOnly affects values below R.").
    setRequiredContextKeys("Input Range A", "Input Range R").
    setExtraDisableReasonFinder(modulusTooBigChecker("R", span)).
    setActualEffectToShaderProvider(ctx => MODULAR_ADDITION_SHADER.withArgs(
        ...ketArgs(ctx, span, ['A', 'R']),
        WglArg.float("factor", -1))).
    setKnownEffectToParametrizedPermutation((t, a, r) => t < r ? Util.properMod(t - a, r) : t).
    setDrawer(args => DRAW_GATE(args)));

ModularAdditionGates.all = [
    ...ModularAdditionGates.PlusAModRFamily.all,
    ...ModularAdditionGates.MinusAModRFamily.all,
];

export {ModularAdditionGates}
