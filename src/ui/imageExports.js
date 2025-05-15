import { Config } from "../Config.js";

/**
 * 
 * @param {Observable<DisplayedInspector>} displayed
 */

function initImageExports(displayed) {
    const exportJpgButton = document.getElementById('export-jpg-button');
    exportJpgButton.addEventListener('click', () => {
        const canvas = document.getElementById('drawCanvas');
        if (!canvas) {
            alert('Canvas element not found!');
            return;
        }

        let cur = displayed.get();
        const toolboxHeight = 230;
        let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING;
        let circuitAreaWidth = 0;
        if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
            circuitAreaWidth = 100;
            circuitAreaHeight = 130;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length != 0) {
            let len = cur.displayedCircuit.circuitDefinition.columns.length;

            let baseOffset;
            if (len <= 2) {
                baseOffset = 40;
            } else {
                baseOffset = 40 + (len - 2) * 5;
            }

            circuitAreaWidth = len * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + baseOffset;
        }
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = circuitAreaWidth;
        offscreenCanvas.height = circuitAreaHeight;

        const offscreenContext = offscreenCanvas.getContext('2d');

        offscreenContext.drawImage(
            canvas, 
            0, toolboxHeight,             
            circuitAreaWidth, circuitAreaHeight, 
            0, 0,                        
            circuitAreaWidth, circuitAreaHeight 
        );

        const imageURL = offscreenCanvas.toDataURL('image/jpeg', 1.0);
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'quirk-e-circuit.jpg';
        downloadLink.click();
    });

    const exportPngButton = document.getElementById('export-png-button');
    exportPngButton.addEventListener('click', () => {
        const canvas = document.getElementById('drawCanvas');
        if (!canvas) {
            alert('Canvas element not found!');
            return;
        }

        let cur = displayed.get();
        const toolboxHeight = 230;
        let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING;
        let circuitAreaWidth = 0;
        if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
            circuitAreaWidth = 50;
            circuitAreaHeight = 130;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length != 0) {
            let len = cur.displayedCircuit.circuitDefinition.columns.length;

            let baseOffset;
            if (len <= 2) {
                baseOffset = 40;
            } else {
                baseOffset = 40 + (len - 2) * 5;
            }

            circuitAreaWidth = len * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + baseOffset;
        }

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = circuitAreaWidth;
        offscreenCanvas.height = circuitAreaHeight;

        const offscreenContext = offscreenCanvas.getContext('2d');

        offscreenContext.drawImage(
            canvas, 
            0, toolboxHeight,            
            circuitAreaWidth, circuitAreaHeight, 
            0, 0,                      
            circuitAreaWidth, circuitAreaHeight 
        );

        const imageURL = offscreenCanvas.toDataURL('image/png', 1.0);
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'quirk-e-circuit.png';
        downloadLink.click();
    });

    const exportWebpButton = document.getElementById('export-webp-button');
    exportWebpButton.addEventListener('click', () => {
        const canvas = document.getElementById('drawCanvas');
        if (!canvas) {
            alert('Canvas element not found!');
            return;
        }

        let cur = displayed.get();
        const toolboxHeight = 230;
        let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING;
        let circuitAreaWidth = 0;
        if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
            circuitAreaWidth = 50;
            circuitAreaHeight = 130;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length != 0) {
            let len = cur.displayedCircuit.circuitDefinition.columns.length;

            let baseOffset;
            if (len <= 2) {
                baseOffset = 40;
            } else {
                baseOffset = 40 + (len - 2) * 5;
            }

            circuitAreaWidth = len * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + baseOffset;
        }

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = circuitAreaWidth;
        offscreenCanvas.height = circuitAreaHeight;

        const offscreenContext = offscreenCanvas.getContext('2d');

        offscreenContext.drawImage(
            canvas, 
            0, toolboxHeight,            
            circuitAreaWidth, circuitAreaHeight, 
            0, 0,                         
            circuitAreaWidth, circuitAreaHeight
        );

        const imageURL = offscreenCanvas.toDataURL('image/webp', 1.0);
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'quirk-e-circuit.webp';
        downloadLink.click();
    });

    const exportSvgButton = document.getElementById('export-svg-button');
    exportSvgButton.addEventListener('click', () => {
        const canvas = document.getElementById('drawCanvas');
        if (!canvas) {
            alert('Canvas element not found!');
            return;
        }

        let cur = displayed.get();
        const toolboxHeight = 230;
        let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING;
        let circuitAreaWidth = 0;
        if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
            circuitAreaWidth = 50;
            circuitAreaHeight = 130;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length != 0) {
            let len = cur.displayedCircuit.circuitDefinition.columns.length;

            let baseOffset;
            if (len <= 2) {
                baseOffset = 40;
            } else {
                baseOffset = 40 + (len - 2) * 5;
            }

            circuitAreaWidth = len * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + baseOffset;
        }

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = circuitAreaWidth;
        offscreenCanvas.height = circuitAreaHeight;

        const offscreenContext = offscreenCanvas.getContext('2d');
        offscreenContext.drawImage(
            canvas,
            0, toolboxHeight,        
            circuitAreaWidth, circuitAreaHeight, 
            0, 0,                        
            circuitAreaWidth, circuitAreaHeight 
        );

        const imageData = offscreenCanvas.toDataURL('image/png');

        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${circuitAreaWidth}" height="${circuitAreaHeight}">
                <image href="${imageData}" width="${circuitAreaWidth}" height="${circuitAreaHeight}" />
            </svg>
        `;

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'quirk-e-circuit.svg';
        downloadLink.click();
    });

    const exportPdfButton = document.getElementById('export-pdf-button');
    exportPdfButton.addEventListener('click', () => {
        const canvas = document.getElementById('drawCanvas');
        if (!canvas) {
            alert('Canvas element not found!');
            return;
        }

        let cur = displayed.get();
        const toolboxHeight = 230;
        let circuitAreaHeight = cur.displayedCircuit.circuitDefinition.numWires * Config.WIRE_SPACING;
        let circuitAreaWidth = 0;
        if(cur.displayedCircuit.circuitDefinition.columns.length === 0) {
            circuitAreaWidth = 50;
            circuitAreaHeight = 130;
        }
        if(cur.displayedCircuit.circuitDefinition.columns.length != 0) {
            let len = cur.displayedCircuit.circuitDefinition.columns.length;

            let baseOffset;
            if (len <= 2) {
                baseOffset = 40;
            } else {
                baseOffset = 40 + (len - 2) * 5;
            }

            circuitAreaWidth = len * (Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING) + baseOffset;
        }

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = circuitAreaWidth;
        offscreenCanvas.height = circuitAreaHeight;

        const offscreenContext = offscreenCanvas.getContext('2d');
        offscreenContext.drawImage(
            canvas,
            0, toolboxHeight, 
            circuitAreaWidth, circuitAreaHeight,
            0, 0, 
            circuitAreaWidth, circuitAreaHeight
        );

        const imgData = offscreenCanvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf; 
        const pdf = new jsPDF('landscape', 'px', [circuitAreaWidth, circuitAreaHeight]);
        pdf.addImage(imgData, 'PNG', 0, 0, circuitAreaWidth, circuitAreaHeight);
        pdf.save('quirk-e-circuit.pdf'); 
    });
}

export {initImageExports};