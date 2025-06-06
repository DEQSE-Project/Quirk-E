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
import {GateBuilder} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Rect} from "../math/Rect.js"

let SpacerGate = new GateBuilder().
    setSerializedIdAndSymbol("…").
    setTitle("Spacer").
    setBlurb("A gate with no effect.").
    markAsNotInterestedInControls().
    promiseHasNoNetEffectOnStateVector().
    setDrawer(args => {
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.OTHER_COLOR;
        let usedHighLight = Config.OTHER_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        if (args.isInToolbox || args.isHighlighted) {
            let backColor = isColored ? usedColor : Config.DEFAULT_FILL_COLOR;
            if (args.isHighlighted) {
                backColor = isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR;
            }
            args.painter.fillRect(args.rect, backColor);
            GatePainting.paintOutline(args);
        } else {
            // Whitespace for the ellipsis.
            let {x, y} = args.rect.center();
            let r = new Rect(x - 14, y - 2, 28, 4);
            args.painter.fillRect(r, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
        }
        args.painter.fillCircle(args.rect.center().offsetBy(7, 0), 2, "black");
        args.painter.fillCircle(args.rect.center(), 2, "black");
        args.painter.fillCircle(args.rect.center().offsetBy(-7, 0), 2, "black");
    }).
    gate;

export {SpacerGate}
