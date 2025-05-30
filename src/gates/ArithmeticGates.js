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
import {GatePainting} from "../draw/GatePainting.js"
import {ketArgs, ketShaderPermute, ketInputGateShaderCode} from "../circuit/KetShaderUtil.js"
import {WglArg} from "../webgl/WglArg.js"
import {Config} from "../Config.js"

let ArithmeticGates = {};

const chunkedScaledAdditionPermutationMaker = (span, factor) => e => {
    let sa = Math.floor(span/2);
    let sb = Math.ceil(span/2);
    let a = e & ((1 << sa) - 1);
    let b = e >> sa;
    b += a * factor;
    b &= ((1 << sb) - 1);
    return a + (b << sa);
};

const ADDITION_SHADER = ketShaderPermute(
    `
        uniform float factor;
        ${ketInputGateShaderCode('A')}
    `,
    `
        float d = read_input_A();
        d *= factor;
        d = mod(d, span);
        return mod(out_id + span - d, span);`);

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

ArithmeticGates.Legacy_AdditionFamily = Gate.buildFamily(2, 16, (span, builder) => builder.
    setSerializedId("add" + span).
    setSymbol("b+=a").
    setTitle("Addition Gate").
    setBlurb("Adds a little-endian number into another.").
    setDrawer(args => DRAW_GATE(args)).
    setActualEffectToUpdateFunc(ctx =>
        ArithmeticGates.PlusAFamily.ofSize(Math.ceil(span/2)).customOperation(
            ctx.withRow(ctx.row + Math.floor(span/2)).
                withInputSetToRange('A', ctx.row, Math.floor(span/2)))).
    setKnownEffectToPermutation(chunkedScaledAdditionPermutationMaker(span, 1)));

ArithmeticGates.Legacy_SubtractionFamily = Gate.buildFamily(2, 16, (span, builder) => builder.
    setAlternateFromFamily(ArithmeticGates.Legacy_AdditionFamily).
    setSerializedId("sub" + span).
    setSymbol("b-=a").
    setTitle("Subtraction Gate").
    setBlurb("Subtracts a little-endian number from another.").
    setDrawer(args => DRAW_GATE(args)).
    setActualEffectToUpdateFunc(ctx =>
        ArithmeticGates.MinusAFamily.ofSize(Math.ceil(span/2)).customOperation(
            ctx.withRow(ctx.row + Math.floor(span/2)).
                withInputSetToRange('A', ctx.row, Math.floor(span/2)))).
    setKnownEffectToPermutation(chunkedScaledAdditionPermutationMaker(span, -1)));

ArithmeticGates.PlusAFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("+=A" + span).
    setSymbol("+A").
    setTitle("Addition Gate [input A]").
    setBlurb("Adds input A into the qubits covered by this gate.").
    setRequiredContextKeys("Input Range A").
    setActualEffectToShaderProvider(ctx => ADDITION_SHADER.withArgs(
        ...ketArgs(ctx, span, ['A']),
        WglArg.float("factor", +1))).
    setDrawer(args => DRAW_GATE(args)).
    setKnownEffectToParametrizedPermutation((v, a) => (v + a) & ((1 << span) - 1)));

ArithmeticGates.MinusAFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setAlternateFromFamily(ArithmeticGates.PlusAFamily).
    setSerializedId("-=A" + span).
    setSymbol("−A").
    setTitle("Subtraction Gate [input A]").
    setBlurb("Subtracts input A out of the qubits covered by this gate.").
    setRequiredContextKeys("Input Range A").
    setActualEffectToShaderProvider(ctx => ADDITION_SHADER.withArgs(
        ...ketArgs(ctx, span, ['A']),
        WglArg.float("factor", -1))).
    setDrawer(args => DRAW_GATE(args)).
    setKnownEffectToParametrizedPermutation((v, a) => (v - a) & ((1 << span) - 1)));

ArithmeticGates.all = [
    ...ArithmeticGates.Legacy_AdditionFamily.all,
    ...ArithmeticGates.Legacy_SubtractionFamily.all,
    ...ArithmeticGates.PlusAFamily.all,
    ...ArithmeticGates.MinusAFamily.all,
];

export {ArithmeticGates}
