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
import {GateShaders} from "../circuit/GateShaders.js"
import {HalfTurnGates} from "./HalfTurnGates.js"
import {QuarterTurnGates} from "./QuarterTurnGates.js"
import {Config} from "../Config.js"
import {ketArgs, ketShaderPermute} from "../circuit/KetShaderUtil.js";
import {WglArg} from "../webgl/WglArg.js";
import {Util} from "../base/Util.js";

let Controls = {};

Controls.Control = new GateBuilder().
    setSerializedIdAndSymbol("•").
    setTitle("Control").
    setBlurb("Conditions on a qubit being ON.\nGates in the same column only apply to states meeting the condition.").
    promiseHasNoNetEffectOnStateVector().
    markAsControlExpecting(true).
    promiseEffectIsUnitary().
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        if(args.isInToolbox) {
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
            args.painter.fillCircle(args.rect.center(), 5, "black");
        }
        else {
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                args.painter.strokeRect(args.rect, 'black');
            }
            args.painter.fillCircle(args.rect.center(), 5, "black");
        }
       
    }).
    gate;

Controls.AntiControl = new GateBuilder().
    setAlternate(Controls.Control).
    setSerializedIdAndSymbol("◦").
    setTitle("Anti-Control").
    setBlurb("Conditions on a qubit being OFF.\nGates in the same column only apply to states meeting the condition.").
    promiseHasNoNetEffectOnStateVector().
    markAsControlExpecting(false).
    promiseEffectIsUnitary().
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if(args.isInToolbox) {
             // Fill the gate with the configured fill color
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            let p = args.rect.center();
            args.painter.fillCircle(p, 5, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeCircle(p, 5);
        
            // Highlight the gate if needed (when `args.isHighlighted` is true)
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                let p = args.rect.center();
            args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            args.painter.strokeCircle(p, 5);
            }
            if (args.isInToolbox) {
                let r = args.rect.shiftedBy(0.5, 0.5);
                args.painter.strokeLine(r.topRight(), r.bottomRight());
                args.painter.strokeLine(r.bottomLeft(), r.bottomRight());
            }
            args.painter.strokeRect(args.rect, 'black');
        }
        else {
             let p = args.rect.center();
             args.painter.fillCircle(p, 5, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
             args.painter.strokeCircle(p, 5);
         
             // Highlight the gate if needed (when `args.isHighlighted` is true)
             if (args.isHighlighted) {
                 args.painter.fillRect(args.rect, isColored ? usedColor : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                 let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                args.painter.strokeRect(args.rect, 'black');
             }
             if (args.isInToolbox) {
                 let r = args.rect.shiftedBy(0.5, 0.5);
                 args.painter.strokeLine(r.topRight(), r.bottomRight());
                 args.painter.strokeLine(r.bottomLeft(), r.bottomRight());
             }
        }
    }).
    gate;

Controls.XAntiControl = new GateBuilder().
    setSerializedId("⊕").  // The drawn +/- convention was changed, but the serialized id must stay the same.
    setSymbol("⊖").
    setTitle("X-Axis Anti-Control").
    setBlurb("Conditions on a qubit being ON+OFF.\n" +
        "Gates in the same column only apply to states meeting the condition.").
    markAsControlExpecting(false).
    setSetupCleanupEffectToUpdateFunc(
        HalfTurnGates.H.customOperation,
        HalfTurnGates.H.customOperation).
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if(args.isInToolbox) {
             // Fill the gate with the configured fill color
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            let p = args.rect.center();
            args.painter.fillCircle(p, 5, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeCircle(p, 5);
            args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
        
            // Highlight the gate if needed (when `args.isHighlighted` is true)
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
            }
            args.painter.strokeRect(args.rect, 'black');
        }
        else {
             let p = args.rect.center();
             args.painter.fillCircle(p, 5, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
             args.painter.strokeCircle(p, 5);
             args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
         
             // Highlight the gate if needed (when `args.isHighlighted` is true)
             if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                args.painter.strokeRect(args.rect, 'black');
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
             }
             
        }
    }).
    gate;

Controls.XControl = new GateBuilder().
    setAlternate(Controls.XAntiControl).
    setSerializedId("⊖").  // The drawn +/- convention was changed, but the serialized id must stay the same.
    setSymbol("⊕").
    setTitle("X-Axis Control").
    setBlurb("Conditions on a qubit being ON-OFF.\n" +
        "Gates in the same column only apply to states meeting the condition.").
    markAsControlExpecting(true).
    setSetupCleanupEffectToUpdateFunc(
        HalfTurnGates.H.customOperation,
        HalfTurnGates.H.customOperation).
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if(args.isInToolbox) {
            // Fill the gate with the configured fill color
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            let p = args.rect.center();
            args.painter.fillCircle(p, 5, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeCircle(p, 5);
            args.painter.strokeLine(p.offsetBy(0, -5), p.offsetBy(0, +5));
            args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
        
            // Highlight the gate if needed (when `args.isHighlighted` is true)
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                args.painter.strokeLine(p.offsetBy(0, -5), p.offsetBy(0, +5));
                args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
            }
            args.painter.strokeRect(args.rect, 'black');
        }
        else {
            let p = args.rect.center();
            args.painter.fillCircle(p, 5, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
            args.painter.strokeCircle(p, 5);
            args.painter.strokeLine(p.offsetBy(0, -5), p.offsetBy(0, +5));
            args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
        
            // Highlight the gate if needed (when `args.isHighlighted` is true)
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                args.painter.strokeRect(args.rect, 'black');
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                args.painter.strokeLine(p.offsetBy(0, -5), p.offsetBy(0, +5));
                args.painter.strokeLine(p.offsetBy(-5, 0), p.offsetBy(+5, 0));
            }
        }        
    }).
    gate;

Controls.YAntiControl = new GateBuilder().
    setSerializedId("⊗").  // The drawn cross/slash convention was changed, but the serialized id must stay the same.
    setSymbol("(/)").
    setTitle("Y-Axis Anti-Control").
    setBlurb("Conditions on a qubit being ON+iOFF.\n" +
        "Gates in the same column only apply to states meeting the condition.").
    markAsControlExpecting(false).
    setSetupCleanupEffectToUpdateFunc(
        ctx => GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXForward._knownMatrix),
        ctx => GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXBackward._knownMatrix)).
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if(args.isInToolbox) {
             // Fill the gate with the configured fill color
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            let p = args.rect.center();
            args.painter.fillCircle(p, 5, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeCircle(p, 5);
            let r = 5*Math.sqrt(0.5)*1.1;
            args.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
        
            // Highlight the gate if needed (when `args.isHighlighted` is true)
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                let r = 5*Math.sqrt(0.5)*1.1;
                args.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
            }
            args.painter.strokeRect(args.rect, 'black');
        }
        else {
            if (args.isHighlighted) {
                args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
                args.painter.strokeRect(args.rect, 'black');
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
                args.painter.strokeCircle(p, 5);
                let r = 5*Math.sqrt(0.5)*1.1;
                args.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
            }
            else {
                let p = args.rect.center();
                args.painter.fillCircle(p, 5, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
                args.painter.strokeCircle(p, 5);
                let r = 5*Math.sqrt(0.5)*1.1;
                args.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
            }
        }
    }).
    gate;

Controls.YControl = new GateBuilder().
    setAlternate(Controls.YAntiControl).
    setSerializedId("(/)").  // The drawn cross/slash convention was changed, but the serialized id must stay the same.
    setSymbol("⊗").
    setTitle("Y-Axis Control").
    setBlurb("Conditions on a qubit being ON-iOFF.\n" +
        "Gates in the same column only apply to states meeting the condition.").
    markAsControlExpecting(true).
    setSetupCleanupEffectToUpdateFunc(
        ctx => GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXForward._knownMatrix),
        ctx => GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXBackward._knownMatrix)).
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    setDrawer(ctx => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.VISUALIZATION_AND_PROBES_COLOR;
        let usedHighLight = Config.VISUALIZATION_AND_PROBES_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        if (ctx.isInToolbox) {
            ctx.painter.fillRect(ctx.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            if(ctx.isHighlighted) {
                ctx.painter.fillRect(ctx.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            }
            GatePainting.paintOutline(ctx);
        }
        let p = ctx.rect.center();
        if(ctx.isInToolbox) {
            ctx.painter.fillCircle(p, 5, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        }
        if(ctx.isHighlighted) {
            ctx.painter.fillRect(ctx.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            ctx.painter.fillCircle(p, 5, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            GatePainting.paintOutline(ctx);
            ctx.painter.strokeCircle(p, 5);
            let r = 5*Math.sqrt(0.5);
            ctx.painter.strokeLine(p.offsetBy(+r, +r), p.offsetBy(-r, -r));
            ctx.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
        }
        else {
            ctx.painter.strokeCircle(p, 5);
            let r = 5*Math.sqrt(0.5);
            ctx.painter.strokeLine(p.offsetBy(+r, +r), p.offsetBy(-r, -r));
            ctx.painter.strokeLine(p.offsetBy(+r, -r), p.offsetBy(-r, +r));
        }
    }).
    gate;

const PARITY_SHADER = ketShaderPermute(
    `
        uniform float parityMask;
    `,
    `
        float bitPos = 1.0;
        float result = 0.5;
        for (int i = 0; i < ${Config.MAX_WIRE_COUNT}; i++) {
            float maskBit = mod(floor(parityMask/bitPos), 2.0);
            float posBit = mod(floor(full_out_id/bitPos), 2.0);
            float flip = maskBit * posBit;
            result += flip;
            bitPos *= 2.0;
        }
        return mod(result, 2.0) - 0.5;`,
    1);

/**
 * Applies a multi-target CNOT operation, merging the parities onto a single qubit (or reversing that process).
 *
 * Note that this method is invoked for each parity control, but only the last one in the column is supposed to
 * perform the operation (or, when uncomputing, the first one).
 *
 * @param {!CircuitEvalContext} ctx
 * @param {!boolean} order
 */
function parityGatherScatter(ctx, order) {
    let c = ctx.rawControls;
    let isLast = 2 << ctx.row > c.parityMask;
    let isFirst = 1 << ctx.row === (c.parityMask & ~(c.parityMask - 1));
    if (order ? isLast : isFirst) {
        ctx.applyOperation(PARITY_SHADER.withArgs(
            ...ketArgs(ctx.withRow(Util.ceilLg2(c.parityMask & c.inclusionMask))),
            WglArg.float('parityMask', c.parityMask)
        ));
    }
}

/**
 * @param {!string} name
 * @returns {!function(args: !GateDrawParams)}
 */
function parityDrawer(name) {
    return args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
        let usedColor = Config.LOGICAL_AND_PARITY_COLOR;
        let usedHighLight = Config.LOGICAL_AND_PARITY_HIGHLIGHT;
        if(isColored && isYellowMode) {
            usedColor = Config.YELLOW;
            usedHighLight = Config.YELLOW_HIGHLIGHT;
        }
        const isDarkMode = localStorage.getItem('dark_mode') === 'true';
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            GatePainting.paintOutline(args);
            let center = args.rect.paddedBy(-10);
            args.painter.fillRect(center, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            args.painter.strokeRect(center);
            args.painter.fillRect(center.paddedBy(-4).skipBottom(-6).skipTop(-6), isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            args.painter.printLine(name, center, 0.5, undefined, undefined, undefined, 0);
            args.painter.printLine('par', center, 0.5, Config.RED, 10, undefined, 1);
        }
        else if (args.isInToolbox && !args.isHighlighted)
        {
            args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            GatePainting.paintOutline(args);
            let center = args.rect.paddedBy(-10);
            args.painter.fillRect(center, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.strokeRect(center);
            args.painter.fillRect(center.paddedBy(-4).skipBottom(-6).skipTop(-6), isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
            args.painter.printLine(name, center, 0.5, undefined, undefined, undefined, 0);
            args.painter.printLine('par', center, 0.5, Config.RED, 10, undefined, 1);
        }
        else {
            let center = args.rect.paddedBy(-10);
            args.painter.fillRect(center, isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
            args.painter.strokeRect(center);
            args.painter.fillRect(center.paddedBy(-4).skipBottom(-6).skipTop(-6), isDarkMode ? Config.DARK_BG_CIRCUIT : Config.BACKGROUND_COLOR_CIRCUIT);
            args.painter.printLine(name, center, 0.5, undefined, undefined, undefined, 0);
            args.painter.printLine('par', center, 0.5, Config.RED, 10, undefined, 1);
        }
    }
}

Controls.XParityControl = new GateBuilder().
    setSerializedIdAndSymbol("xpar").
    setTitle("Parity Control (X)").
    setBlurb("Includes a qubit's X observable in the column parity control.\n" +
        "Gates in the same column only apply if an odd number of parity controls are satisfied.").
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    markAsControlExpecting('parity').
    setSetupCleanupEffectToUpdateFunc(
        ctx => {
            HalfTurnGates.H.customOperation(ctx);
            parityGatherScatter(ctx, true);
        },
        ctx => {
            parityGatherScatter(ctx, false);
            HalfTurnGates.H.customOperation(ctx);
        }).
    setDrawer(parityDrawer('X')).
    gate;

Controls.YParityControl = new GateBuilder().
    setSerializedIdAndSymbol("ypar").
    setTitle("Parity Control (Y)").
    setBlurb("Includes a qubit's Y observable in the column parity control.\n" +
        "Gates in the same column only apply if an odd number of parity controls are satisfied.").
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsStable().
    promiseEffectIsUnitary().
    markAsControlExpecting('parity').
    setSetupCleanupEffectToUpdateFunc(
        ctx => {
            GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXForward._knownMatrix);
            parityGatherScatter(ctx, true);
        },
        ctx => {
            parityGatherScatter(ctx, false);
            GateShaders.applyMatrixOperation(ctx, QuarterTurnGates.SqrtXBackward._knownMatrix);
        }).
    setDrawer(parityDrawer('Y')).
    gate;

Controls.ZParityControl = new GateBuilder().
    setSerializedIdAndSymbol("zpar").
    setTitle("Parity Control (Z)").
    setBlurb("Includes a qubit's Z observable in the column parity control.\n" +
        "Gates in the same column only apply if an odd number of parity controls are satisfied.").
    promiseHasNoNetEffectOnStateVector().
    markAsControlExpecting('parity').
    setSetupCleanupEffectToUpdateFunc(
        ctx => parityGatherScatter(ctx, true),
        ctx => parityGatherScatter(ctx, false)).
    setActualEffectToUpdateFunc(() => {}).
    promiseEffectIsUnitary().
    setDrawer(parityDrawer('Z')).
    gate;

Controls.all = [
    Controls.Control,
    Controls.AntiControl,
    Controls.XAntiControl,
    Controls.XControl,
    Controls.YAntiControl,
    Controls.YControl,
    Controls.XParityControl,
    Controls.YParityControl,
    Controls.ZParityControl,
];

export {Controls}
