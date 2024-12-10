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

/** @type {!Gate} */
const ZeroGate = new GateBuilder().
    setSerializedIdAndSymbol("0").
    setTitle("Nothing Gate").
    setBlurb("Destroys the universe.").
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.MATH_COLOR;
        let usedHighLight = Config.MATH_HIGHLIGHT;
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
        if (args.isInToolbox) {
            let r = args.rect.shiftedBy(0.5, 0.5);
            args.painter.strokeLine(r.topRight(), r.bottomRight());
            args.painter.strokeLine(r.bottomLeft(), r.bottomRight());
        }
        args.painter.strokeRect(args.rect, 'black');
    }).
    setKnownEffectToMatrix(Matrix.square(0, 0, 0, 0)).
    gate;

export {ZeroGate}
