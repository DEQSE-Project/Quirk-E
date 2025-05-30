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

import {Config} from "../Config.js"
import {Gate} from "../circuit/Gate.js"
import {ketArgs, ketShaderPermute} from "../circuit/KetShaderUtil.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Point} from "../math/Point.js"
import {Seq} from "../base/Seq.js"

let InterleaveBitsGates = {};

/**
 * Transforms from a block bit position to a striped bit position.
 * @param {!int} bit
 * @param {!int} len
 * @returns {!int}
 */
function interleaveBit(bit, len) {
    let h = Math.ceil(len / 2);
    let group = Math.floor(bit / h);
    let stride = bit % h;
    return stride * 2 + group;
}

/**
 * Transforms from a striped bit position to a block bit position.
 * @param {!int} bit
 * @param {!int} len
 * @returns {!int}
 */
function deinterleaveBit(bit, len) {
    let h = Math.ceil(len / 2);
    let stride = Math.floor(bit / 2);
    let group = bit % 2;
    return stride + group * h;
}

/**
 * Constructs a shader that permutes bits based on the given function.
 * @param {!int} span
 * @param {!function(bit: !int, len: !int) : !int} bitPermutation
 * @return {!{withArgs: !function(args: ...!WglArg|!WglTexture) : !WglConfiguredShader}}
 */
function shaderFromBitPermutation(span, bitPermutation) {
    let bitMoveLines = [];
    for (let i = 0; i < span; i++) {
        bitMoveLines.push(`r += mod(floor(out_id / ${1 << bitPermutation(i, span)}.0), 2.0) * ${1 << i}.0;`);
    }

    return ketShaderPermute(
        '',
        `
            float r = 0.0;
            ${bitMoveLines.join(`
            `)}
            return r;
        `,
        span);
}

/**
 * @type {!Map.<!int, !{withArgs: !function(args: ...!WglArg|!WglTexture) : !WglConfiguredShader}>}
 */
let _interleaveShadersForSize = Seq.range(Config.MAX_WIRE_COUNT + 1).
    skip(2).
    toMap(k => k, k => shaderFromBitPermutation(k, interleaveBit));

/**
 * @type {!Map.<!int, !{withArgs: !function(args: ...!WglArg|!WglTexture) : !WglConfiguredShader}>}
 */
let _deinterleaveShadersForSize = Seq.range(Config.MAX_WIRE_COUNT + 1).
    skip(2).
    toMap(k => k, k => shaderFromBitPermutation(k, deinterleaveBit));

let interleavePainter = reverse => args => {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
    let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
    if(isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighLight = Config.YELLOW_HIGHLIGHT;
    }
    if (args.positionInCircuit !== undefined) {
        GatePainting.PERMUTATION_DRAWER(args);
        let color = isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR; // Assume this is "#FF0000" (red)
        let alpha = 0.5; // Desired opacity (50% transparent)

        // Convert alpha to a two-digit hex value
        let alphaHex = Math.round(alpha * 255).toString(16).padStart(2, "0"); // E.g., 0.5 -> "80"

        // Add the alpha value to the color
        let colorWithTransparency = color + alphaHex; // E.g., "#FF0000" -> "#FF000080"
        
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, colorWithTransparency, 2);
        }
        return;
    }

    // Fill the gate with the configured fill color
    args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
    
    // Highlight the gate if needed (when `args.isHighlighted` is true)
    if (args.isHighlighted) {
        args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
    }
    args.painter.strokeRect(args.rect, 'black');
    GatePainting.paintResizeTab(args);

    let x1 = args.rect.x + 6;
    let x2 = args.rect.right() - 6;
    let y = args.rect.center().y - Config.GATE_RADIUS + 6;
    let dh = ((Config.GATE_RADIUS - 6)*2 - 14) / 5;

    for (let i = 0; i < 6; i++) {
        let j = interleaveBit(i, 6);
        let yi = y + i*dh + Math.floor(i/3)*14;
        let yj = y + j*dh + Math.floor(j/2)*7;
        let [y1, y2] = reverse ? [yj, yi] : [yi, yj];
        args.painter.strokePath([
            new Point(x1, y1),
            new Point(x1 + 8, y1),
            new Point(x2 - 8, y2),
            new Point(x2, y2)
        ]);
    }
};

InterleaveBitsGates.InterleaveBitsGateFamily = Gate.buildFamily(4, 16, (span, builder) => builder.
    setSerializedId("weave" + span).
    setSymbol("Interleave").
    setTitle("Interleave").
    setBlurb("Re-orders blocks of bits into stripes of bits.").
    setWidth(span <= 8 ? 1 : 2).
    setDrawer(interleavePainter(false)).
    setActualEffectToShaderProvider(ctx => _interleaveShadersForSize.get(span).withArgs(...ketArgs(ctx, span))).
    setKnownEffectToBitPermutation(b => interleaveBit(b, span)));

InterleaveBitsGates.DeinterleaveBitsGateFamily = Gate.buildFamily(4, 16, (span, builder) => builder.
    setAlternateFromFamily(InterleaveBitsGates.InterleaveBitsGateFamily).
    setSerializedId("split" + span).
    setSymbol("Deinterleave").
    setTitle("Deinterleave").
    setBlurb("Re-orders stripes of bits into blocks of bits.").
    setWidth(span <= 8 ? 1 : 2).
    setDrawer(interleavePainter(true)).
    setActualEffectToShaderProvider(ctx => _deinterleaveShadersForSize.get(span).withArgs(...ketArgs(ctx, span))).
    setKnownEffectToBitPermutation(b => deinterleaveBit(b, span)));

InterleaveBitsGates.all = [
    ...InterleaveBitsGates.InterleaveBitsGateFamily.all,
    ...InterleaveBitsGates.DeinterleaveBitsGateFamily.all
];

export {
    InterleaveBitsGates,
    interleaveBit,
    deinterleaveBit,
    shaderFromBitPermutation
}
