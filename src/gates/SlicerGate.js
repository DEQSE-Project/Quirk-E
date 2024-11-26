import {Gate} from "../circuit/Gate.js"
import {GatePainting} from "../draw/GatePainting.js"
import {Config} from "../Config.js"

/**
 * @param {!GateDrawParams} args
 */
function drawSlicerGate(args) {
    GatePainting.paintResizeTab(args);

    // Drawn as box with a dashed line
    if (args.isInToolbox) {
        let backColor = Config.OTHER_COLOR;
        if (args.isHighlighted) {
            backColor = Config.OTHER_HIGHLIGHT;
        }
        args.painter.fillRect(args.rect, backColor);
        GatePainting.paintOutline(args)


        args.painter.strokeDashedLine(
            args.rect.center().offsetBy(0, 10),
            args.rect.center().offsetBy(0, -10),
        "black", 1, [4, 4]);

    } else {
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
