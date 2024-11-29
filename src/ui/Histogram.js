import {Config} from "../Config.js"
import {Painter} from "../draw/Painter.js"
import {CircuitStats} from "../circuit/CircuitStats.js"
import {Rect} from "../math/Rect.js"
import {Hand} from "../ui/Hand.js"
import {Point} from "../math/Point.js"
import {Util} from "../base/Util.js"
import {MathPainter} from "../draw/MathPainter.js"
import {Format} from "../base/Format.js"

class Histogram {
    /**
     * Histogram displaying result probabilities.
     * @param {!number} top
     */
    constructor(top) {
        this.top = top;
    }

    /**
     * @param {!number} newTop
     * @returns {!Histogram}
     */
    withTop(newTop) {
        return new Histogram(newTop);
    }

    desiredHeight() {
        return 360;
    }
    
    desiredWidth() {
        return 860;
    }

    /**
     * @param {!Painter} painter
     * @param {!Number} num_wires
     */
    histogramArea(painter, num_wires) {
        let margin_top = 10;
        let margin_X = Config.TOOLBOX_MARGIN_X;
        let margin_bottom = 48 + 12;

        let width = num_wires < 5 ? this.desiredWidth() - margin_X : painter.canvas.width - margin_X * 2;
        let height = this.desiredHeight() - margin_top - margin_bottom;
        return new Rect(margin_X, this.top + margin_top, width, height);
    }

    /**
     * @param {!Painter} painter   
     * @param {!Rect} area
     */
    drawYAxisTitle(painter, area) {
        let r = area.withX(0).withW(Config.TOOLBOX_MARGIN_X / 2);
        let {x, y} = r.center();
        painter.ctx.save();
        painter.ctx.translate(x, y);
        painter.ctx.rotate(-Math.PI/2);
        painter.printLine("Probability (%)", new Rect(-r.h / 2, -r.w / 2, r.h, r.w), 0.5, 'black', 12);
        painter.ctx.restore();
    }
    
    /**
     * @param {!Painter} painter   
     */
    drawXAxisTitle(painter, area, numWires) {
        let margin = (numWires < 6) ? 36 : 12;
        let belowBars = area.withY(this.top + this.desiredHeight() - margin).withH(12);
        painter.printLine("Computational basis", belowBars, 0.5, 'black', 12);
    }
    
    /**
     * @param {!Painter} painter   
     * @param {!Rect} area
     */
    drawAxeNumbers(painter, area) {
        let r = area.withX(Config.TOOLBOX_MARGIN_X / 2).withW(Config.TOOLBOX_MARGIN_X / 2);
        let font_size = 8;
        
        for(let probability of [0, 20, 40, 60, 80, 100]) {
            let y = r.bottom() - r.h * (probability / 100) - 1;
            painter.printLine(probability + "%", new Rect(r.x, y - font_size / 2, Config.TOOLBOX_MARGIN_X / 2, font_size));
        };
    }
 
    /**
     * @param {!Painter} painter
     * @param {!Rect} area
     */
    drawAxes(painter, area) {
        let b = area.bottom();
        let { x, w, h } = area;
        for(let probability of [20, 40, 60, 80]) {
            let y = b - h * (probability / 100) - 1;
            painter.strokeLine(new Point(x, y), new Point(x + w, y), 'grey');
        };
    }
    
    /**
     * @param {!Painter} painter
     * @param {!Hand} hand
     * @param {!CircuitStats} stats
     * @param {!Rect} area
     */
    drawBars(painter, hand, stats, area) {
        let bar_count = stats.finalState.height();
        stats.finalState.getColumn(0).forEach((amplitude, index) => {
            let padding = bar_count < 32 ? area.w / (3 * bar_count) : 0;

            // squared euclidean length, coincidentally the probability.
            let probability = amplitude.norm2(); 
            let label = `${Util.bin(index, Util.bitSize(bar_count - 1))}`;

            let width = area.w / bar_count - padding * (bar_count + 1) / bar_count;
            let x = area.x + index * width + (1 + index) * padding;

            if(bar_count <= 32) { // draw label, if there's enough space.
                painter.printLine(label, new Rect(x, area.bottom(), width, 24), 0.5);
            } else {
                painter.ctx.save();
                painter.ctx.translate(x, this.top + this.desiredHeight());
                painter.ctx.rotate(-Math.PI/2);
                painter.printLine(label, new Rect(0, 0, this.top + this.desiredHeight() - area.bottom() + 12, width), 0.5, undefined, undefined, undefined, 0.5);
                painter.ctx.restore();
            }
            
            if(probability > 0) { // do not draw empty bar
                let height = probability * area.h;
                let bar = new Rect(x, area.bottom() - height, width, height);

                painter.fillRect(bar, Config.SUPERPOSITION_MID_COLOR); // todo bar color

                if(hand.hoverPoints().some(point => bar.containsPoint(point))) {
                    painter.strokeRect(bar, 'orange', 2);
                    MathPainter.paintDeferredValueTooltip(painter, bar.x + bar.w, bar.y, 
                    `Measured chance of |${label}⟩ (decimal ${index})`,
                    `raw: ${(probability * 100).toFixed(4)}%`,
                    `amplitude: ${amplitude.toString(new Format(false, 0, 5, ", "))}`)
                }
            } 
        });
    }

    /**
     * @param {!Painter} painter
     * @param {!CircuitStats} stats
     * @param {!Hand} hand
     */
    paint(painter, stats, hand) {
        let { numWires } = stats.circuitDefinition;
        let area = this.histogramArea(painter, numWires);

        this.drawYAxisTitle(painter, area);
        this.drawXAxisTitle(painter, area, numWires);
        this.drawAxeNumbers(painter, area);
        this.drawAxes(painter, area);
        if(numWires <= 7) { // don't draw bars with more than 7 wires
            this.drawBars(painter, hand, stats, area);
        } else {
            painter.printLine("Histogram not available for more than 7 wires.", area, 0.5, undefined, 16, undefined, 0.5);
        }
        painter.strokeRect(area); // stroke the rect last so everything appears below it
    }
}

export {Histogram}