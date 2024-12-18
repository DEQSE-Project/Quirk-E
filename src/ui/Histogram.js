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
        return 600;
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
        let margin_bottom = 170;

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
    drawXAxisTitle(painter, area, numWires, stats) {
        let margin = (numWires > 5) ? 80 : 40;
        let titleY = area.bottom() + margin; 
        let titleArea = new Rect(area.x, titleY, area.w, 12);
        painter.printLine("Computational basis states", titleArea, 0.5, 'black', 12);
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

            let probability = amplitude.norm2(); 
            let label = `${Util.bin(index, Util.bitSize(bar_count - 1))}`;

            let width = area.w / bar_count - padding * (bar_count + 1) / bar_count;
            let x = area.x + index * width + (1 + index) * padding;

            if(bar_count <= 32) { // draw label, if there's enough space.
                painter.printLine(label, new Rect(x, area.bottom(), width, 24), 0.5);
            } else {
                painter.ctx.save();
                
                let labelYOffset = 0.46 * (this.top + this.desiredHeight());  // Almost half the original translation distance

                painter.ctx.translate(x, this.top + labelYOffset);  
                painter.ctx.rotate(-Math.PI / 2);
                painter.printLine(label, new Rect(0, 0, this.top + this.desiredHeight() - area.bottom() + 12, width), 0.5, undefined, undefined, undefined, 0.5);
                
                painter.ctx.restore();
            }

            const isColored = localStorage.getItem('colored_ui') === 'true';
            const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
            let usedColor = Config.SAMPLING_AND_PROBABILITY_COLOR;
            let usedHighLight = Config.SAMPLING_AND_PROBABILITY_HIGHLIGHT;
            if(isColored && isYellowMode) {
                usedColor = Config.YELLOW;
                usedHighLight = Config.YELLOW_HIGHLIGHT;
            }

            if(probability > 0) { // do not draw empty bar
                let height = probability * area.h;
                let bar = new Rect(x, area.bottom() - height, width, height);

                painter.fillRect(bar, usedColor); 

                if(hand.hoverPoints().some(point => bar.containsPoint(point))) {
                    painter.fillRect(bar, usedHighLight); 
                    painter.strokeRect(bar, 'black', 2);
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
     * @param {!Rect} area
     * @param {!Hand} hand
     * @param {!Number} num_wires
     */
    outputStateArea(painter, stats, area, hand, numWires) {
        let margin = (numWires > 5) ? 112 : 80;
        let boxWidth = area.w * 0.96;
        let boxHeight = 55;
    
        let boxX = area.center().x - boxWidth / 2;
        let boxY = area.bottom() + margin;
    
        // Text box
        let textBoxRect = new Rect(boxX, boxY, boxWidth, boxHeight);
        painter.fillRect(textBoxRect, 'rgba(223, 223, 223, 0.66)');
        painter.strokeRect(textBoxRect, 'black');
    
        let titleMargin = 10;
        painter.ctx.save();
        painter.ctx.fillStyle = 'black';
        painter.ctx.font = 'bold 12px sans-serif';
        painter.ctx.fillText('Output state', textBoxRect.x + titleMargin, textBoxRect.y + titleMargin + 4);
        painter.ctx.restore();
    
        // Formatted string anbd outputstate value as text
        let outputState = stats.finalState
            .getColumn(0)
            .map((amplitude, index) => `${amplitude.toString(new Format(false, 0, 5, ''))}`)
            .join(', ');
        let formattedState = `[ ${outputState} ]`;
    
        painter.ctx.save();
        painter.ctx.fillStyle = 'black'; 
        painter.ctx.font = '12px arial'; 
        let textY = textBoxRect.y + 30; 
        let textX = textBoxRect.x + 10;
    
        let lineHeight = 16; 
        let maxLines = 2; 
        let words = formattedState.split(' ');
        let currentLine = '';
        let lineCount = 0;
    
        for (let word of words) {
            let testLine = currentLine + word + ' ';
            let testWidth = painter.ctx.measureText(testLine).width;
            if (testWidth > boxWidth - 20) { 
                painter.ctx.fillText(currentLine, textX, textY);
                currentLine = word + ' ';
                textY += lineHeight;
                lineCount++;
    
                if (lineCount === maxLines - 1) {
                    painter.ctx.fillText(currentLine.trim() + ' ...', textX, textY); 
                    break;
                }
            } else {
                currentLine = testLine;
            }
        }
    
        if (lineCount < maxLines) {
            painter.ctx.fillText(currentLine.trim(), textX, textY); 
        }
    
        painter.ctx.restore();
    
        // Copy button
        let buttonWidth = 30;
        let buttonHeight = 30;
        let buttonX = textBoxRect.right() - buttonWidth - 10;
        let buttonY = textBoxRect.y + 5;
    
        let buttonRect = new Rect(buttonX, buttonY, buttonWidth, buttonHeight);
        painter.fillRect(buttonRect, 'transparent'); 
        painter.ctx.save();
        painter.ctx.strokeStyle = 'black';
        painter.ctx.lineWidth = 1.5;
    
        painter.ctx.strokeRect(buttonRect.x + 8, buttonRect.y + 8, 14, 18); 
        painter.ctx.beginPath();
        painter.ctx.arc(buttonRect.x + 15, buttonRect.y + 10, 4, Math.PI, 0); 
        painter.ctx.stroke();
    
        painter.ctx.restore();
    
        painter.canvas.addEventListener('click', (event) => {
            const rect = painter.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
    
            if (
                mouseX >= buttonX &&
                mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY &&
                mouseY <= buttonY + buttonHeight
            ) {
                navigator.clipboard.writeText(formattedState)
                    .then(() => {
                        console.log('Output state copied to clipboard.');
                        painter.fillRect(buttonRect, 'rgba(136, 136, 136, 0.56)');
                        painter.ctx.strokeRect(buttonRect.x + 8, buttonRect.y + 8, 14, 18); 
                        painter.ctx.beginPath();
                        painter.ctx.arc(buttonRect.x + 15, buttonRect.y + 10, 4, Math.PI, 0); 
                        painter.ctx.stroke();
                    })
                    .catch((err) => {
                        console.error('Failed to copy output state: ', err);
                    });
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
        this.drawAxes(painter, area);
        this.drawAxeNumbers(painter, area);
    
        if (numWires <= 7) {
            this.drawBars(painter, hand, stats, area);
        } else {
            painter.printLine("Histogram not available for more than 7 wires.", area, 0.5, undefined, 16, undefined, 0.5);
        }
    
        this.outputStateArea(painter, stats, area, hand, numWires);
    
        this.drawXAxisTitle(painter, area, numWires, stats);
    
        painter.strokeRect(area);
    }
    
}

export {Histogram}