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
import {Config} from "../Config.js"
import {GatePainting} from "../draw/GatePainting.js"

let ModularIncrementGates = {};

/**
 * @param {!string} inputKey
 * @param {!int} span
 * @param {!string=} modName
 * @returns {!function(!GateCheckArgs) : (undefined|!string)}
 */
let modulusTooBigChecker = (inputKey, span, modName='mod') => args => {
    let r = args.context.get('Input Range ' + inputKey);
    let d = args.context.get('Input Default ' + inputKey);
    if (r !== undefined && r.length > span) {
        return `${modName}\ntoo\nbig`;
    }
    if (r === undefined && d !== undefined && d > 1<<span) {
        return `${modName}\ntoo\nbig`;
    }
    return undefined;
};

const MODULAR_INCREMENT_SHADER = ketShaderPermute(
    `
        uniform float amount;
        ${ketInputGateShaderCode('R')}
    `,
    `
        float r = read_input_R();
        return out_id >= r
            ? out_id
            // HACK: sometimes mod(value-equal-to-r, r) returns r instead of 0. The perturbation works around it.
            : floor(mod(out_id + r - amount, r - 0.000001));`);

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

ModularIncrementGates.IncrementModRFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("incmodR" + span).
    setSymbol("+1\nmod R").
    setTitle("Modular Increment Gate").
    setBlurb("Adds 1 into the target, but wraps R-1 to 0.\n" +
        "Only affects values less than R.").
    setRequiredContextKeys("Input Range R").
    setExtraDisableReasonFinder(modulusTooBigChecker("R", span)).
    setActualEffectToShaderProvider(ctx => MODULAR_INCREMENT_SHADER.withArgs(
        ...ketArgs(ctx, span, ['R']),
        WglArg.float("amount", +1))).
    setKnownEffectToParametrizedPermutation((t, a) => t < a ? (t + 1) % a : t).
    setDrawer(args => DRAW_GATE(args)));

ModularIncrementGates.DecrementModRFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setAlternateFromFamily(ModularIncrementGates.IncrementModRFamily).
    setSerializedId("decmodR" + span).
    setSymbol("−1\nmod R").
    setTitle("Modular Decrement Gate").
    setBlurb("Subtracts 1 out of the target, but wraps 0 to R-1.\n" +
        "Only affects values less than R.").
    setRequiredContextKeys("Input Range R").
    setExtraDisableReasonFinder(modulusTooBigChecker("R", span)).
    setActualEffectToShaderProvider(ctx => MODULAR_INCREMENT_SHADER.withArgs(
        ...ketArgs(ctx, span, ['R']),
        WglArg.float("amount", -1))).
    setKnownEffectToParametrizedPermutation((t, a) => t < a ? Util.properMod(t - 1, a) : t).
    setDrawer(args => DRAW_GATE(args)));

ModularIncrementGates.all = [
    ...ModularIncrementGates.IncrementModRFamily.all,
    ...ModularIncrementGates.DecrementModRFamily.all,
];

export {ModularIncrementGates, modulusTooBigChecker}
