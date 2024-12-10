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

import {Gate, GateBuilder} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {reverseShaderForSize} from "./ReverseBitsGate.js"
import {Config} from "../Config.js"

let InputGates = {};

/**
 * @param {!GateDrawParams} args
 * @param {!string} key
 * @param {!boolean} reverse
 */
function drawInputGate(args, key, reverse) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    GatePainting.paintBackground(args, isColored ? Config.SAMPLING_AND_PROBABILITY_COLOR : Config.DEFAULT_FILL_COLOR, isColored ? Config.SAMPLING_AND_PROBABILITY_COLOR : Config.DEFAULT_FILL_COLOR);
    GatePainting.paintOutline(args);

    if (args.isInToolbox) {
        GatePainting.paintResizeTab(args);
    }
    
    if(args.isHighlighted) {
        args.painter.fillRect(args.rect, isColored ? Config.SAMPLING_AND_PROBABILITY_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR);
        args.painter.strokeRect(args.rect, 'black');
    }

    if (!args.isInToolbox) {
        GatePainting.paintResizeTab(args);
    }

    let {x, y} = args.rect.center();
    args.painter.print(
        'input',
        x,
        y-2,
        'center',
        'bottom',
        'black',
        '16px sans-serif',
        args.rect.w - 2,
        args.rect.h / 2);
    args.painter.print(
        key + (reverse ? '[::-1]' : ''),
        x,
        y+2,
        'center',
        'top',
        'black',
        '16px sans-serif',
        args.rect.w - 2,
        args.rect.h / 2);
}

let makeInputGate = (key, reverse) => Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId((reverse ? 'rev' : '') + `input${key}${span}`).
    setSymbol((reverse ? 'rev ' : '') + `input ${key}`).
    setTitle(`Input Gate [${key}]` + (reverse ? ' [reversed]' : '')).
    setBlurb(`Temporarily uses some qubits as input ${key}${reverse ? ', in big-endian order' : ''}.`).
    setDrawer(args => drawInputGate(args, key, reverse)).
    promiseHasNoNetEffectOnStateVector().
    markAsNotInterestedInControls().
    setSetupCleanupEffectsToShaderProviders(
        reverse && span > 1 ? reverseShaderForSize(span) : undefined,
        reverse && span > 1 ? reverseShaderForSize(span) : undefined).
    setContextProvider(qubitIndex => [{
        key: `Input Range ${key}`,
        val: {
            offset: qubitIndex,
            length: span
        }
    }]));

let makeSetInputGate = key => new GateBuilder().
    setSerializedIdAndSymbol(`set${key}`).
    setTitle(`Set Default ${key}`).
    setBlurb(`Sets a default value for input ${key}, for when an inline input isn't given.`).
    setWidth(2).
    setHeight(2).
    promiseHasNoNetEffectOnStateVector().
    markAsNotInterestedInControls().
    markAsReachingOtherWires().
    setStickyContextProvider((qubitIndex, gate) => [{
        key: `Input Default ${key}`,
        val: gate.param,
        sticky: true
    }]).
    setDrawer(args => {
        const isColored = localStorage.getItem('colored_ui') === 'true';
        GatePainting.paintLocationIndependentFrame(args, isColored ? Config.SAMPLING_AND_PROBABILITY_COLOR : Config.DEFAULT_FILL_COLOR, isColored ? Config.SAMPLING_AND_PROBABILITY_COLOR : Config.DEFAULT_FILL_COLOR);
        // Fill the gate with the configured fill color
        args.painter.fillRect(args.rect, isColored ? Config.SAMPLING_AND_PROBABILITY_COLOR : Config.DEFAULT_FILL_COLOR);
        if (args.isInToolbox) {
            let r = args.rect.shiftedBy(0.5, 0.5);
            args.painter.strokeLine(r.topRight(), r.bottomRight());
            args.painter.strokeLine(r.bottomLeft(), r.bottomRight());
        }
        args.painter.strokeRect(args.rect, 'black');
        if (args.isInToolbox) {
            GatePainting.paintGateSymbol(args, `${key}=#\ndefault`);
        } else {
            GatePainting.paintGateSymbol(args, `${key}=${args.gate.param}`);
        }
        GatePainting.paintGateButton(args);
    
        // Highlight the gate if needed (when `args.isHighlighted` is true)
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? Config.SAMPLING_AND_PROBABILITY_HIGHLIGHT : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
            if (args.isInToolbox) {
                let r = args.rect.shiftedBy(0.5, 0.5);
                args.painter.strokeLine(r.topRight(), r.bottomRight());
                args.painter.strokeLine(r.bottomLeft(), r.bottomRight());
            }
            args.painter.strokeRect(args.rect, 'black');
            if (args.isInToolbox) {
                GatePainting.paintGateSymbol(args, `${key}=#\ndefault`);
            } else {
                GatePainting.paintGateSymbol(args, `${key}=${args.gate.param}`);
            }
            GatePainting.paintGateButton(args);
    }}).
    setOnClickGateFunc(oldGate => {
        let txt = prompt(`Enter new fallback value for input ${key} (between 0 and 65535).`,
            '' + oldGate.param);
        if (txt === null || txt.trim() === '') {
            return oldGate;
        }

        let val = parseInt(txt);
        if (!Number.isInteger(val) || val < 0 || val >= 1<<16) {
            alert(`'${txt}' isn't an integer between 0 and 65535. Keeping ${oldGate.param}.`);
            return oldGate;
        }

        return oldGate.withParam(val);
    }).
    setExtraDisableReasonFinder(args => {
        let p = args.gate.param;
        if (!Number.isInteger(p) || p < 0 || p > 1<<16) {
            return 'bad\nvalue';
        }
        return undefined;
    }).
    gate.
    withParam(2);

InputGates.InputAFamily = makeInputGate('A', false);
InputGates.InputBFamily = makeInputGate('B', false);
InputGates.InputRFamily = makeInputGate('R', false);
InputGates.InputRevAFamily = makeInputGate('A', true);
InputGates.InputRevBFamily = makeInputGate('B', true);
InputGates.SetA = makeSetInputGate('A');
InputGates.SetB = makeSetInputGate('B');
InputGates.SetR = makeSetInputGate('R');
InputGates.Letters = ["A", "B", "R"];

InputGates.all = [
    ...InputGates.InputAFamily.all,
    ...InputGates.InputBFamily.all,
    ...InputGates.InputRFamily.all,
    ...InputGates.InputRevAFamily.all,
    ...InputGates.InputRevBFamily.all,
    InputGates.SetA,
    InputGates.SetB,
    InputGates.SetR,
];

export {InputGates}
