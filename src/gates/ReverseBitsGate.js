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
import {Seq} from "../base/Seq.js"
import {GatePainting} from "../draw/GatePainting.js"
import { currentShaderCoder } from "../webgl/ShaderCoders.js"

let _generateReverseShaderForSize = span => span < 2 ? undefined : ketShaderPermute(
    '',
    `
        float rev = 0.0;
        for (int k = 0; k < ${span}; k++) {
            rev *= 2.0;
            rev += mod(out_id, 2.0);
            out_id = floor(out_id*0.5);
        }
        return rev;
    `,
    span);

let reverseShaders = Seq.range(Config.MAX_WIRE_COUNT + 1).map(_generateReverseShaderForSize).toArray();

/**
 * @param {!int} span
 * @returns {!function(!CircuitEvalContext) : !WglConfiguredShader}
 */
let reverseShaderForSize = span => ctx => reverseShaders[span].withArgs(...ketArgs(ctx, span));

let ReverseBitsGateFamily = Gate.buildFamily(2, 16, (span, builder) => builder.
    setSerializedId("rev" + span).
    setSymbol("Reverse").
    setTitle("Reverse Order").
    setBlurb("Swaps bits into the opposite order.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        // Fill the gate with the configured fill color
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
    
        // Highlight the gate if needed (when `args.isHighlighted` is true)
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        GatePainting.paintGateSymbol(args);
        args.painter.strokeRect(args.rect, 'black');
        GatePainting.paintResizeTab(args);
    }).
    setKnownEffectToBitPermutation(i => span - 1 - i).
    setActualEffectToShaderProvider(reverseShaderForSize(span)));

export {ReverseBitsGateFamily, reverseShaderForSize}
