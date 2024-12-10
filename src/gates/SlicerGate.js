import {Gate} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Config} from "../Config.js"

/**
 * @param {!GateDrawParams} args
 */
function drawSlicerGate(args) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.OTHER_COLOR;
    let usedHighLight = Config.OTHER_HIGHLIGHT;
    if(isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighLight = Config.YELLOW_HIGHLIGHT;
    }
    GatePainting.paintResizeTab(args);

    // Drawn as box with a dashed line
    if (args.isInToolbox) {
        let backColor = isColored ? usedColor : Config.DEFAULT_FILL_COLOR;
        if (args.isHighlighted) {
            backColor = isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR;
        }
        args.painter.fillRect(args.rect, backColor);
        GatePainting.paintOutline(args)


        args.painter.strokeDashedLine(
            args.rect.center().offsetBy(0, 10),
            args.rect.center().offsetBy(0, -10),
        "black", 1, [4, 4]);

    } else {
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR);
            GatePainting.paintOutline(args);
        }
        args.painter.strokeDashedLine(
            args.rect.topCenter(),
            args.rect.bottomCenter(),
        "black", 2, [4, 8]);
    }
}
let SlicerGate = new Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("Slicer" + span).
    setSymbol("|").
    setTitle("Slicer").
    setBlurb("Slices the circuit into parts. Has no effect on the outcome.").
    setDrawer(drawSlicerGate).
    markAsNotInterestedInControls().
    promiseHasNoNetEffectOnStateVector());


export {SlicerGate}
