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

import {ObservableValue} from "../base/Obs.js"

const galleryIsVisible = new ObservableValue(true);
const obsGalleryIsShowing = galleryIsVisible.observable().whenDifferent();
let closeGallery = () => galleryIsVisible.set(false);

const groverLink = {
    "cols":[
        ["X","X","X","X","X"],
        ["H","H","H","H","H"],
        ["Chance5"],
        ["~vn6c"],
        ["⊖","⊖","⊖","⊖","X"],
        ["Chance5"],
        ["~vn6c"],
        ["⊖","⊖","⊖","⊖","X"],
        ["Chance5"],
        ["~vn6c"],
        ["⊖","⊖","⊖","⊖","X"],
        ["Chance5"],
        ["~vn6c"],
        ["⊖","⊖","⊖","⊖","X"],
        ["Chance5"]
    ],
    "gates":[{"id":"~vn6c","name":"Oracle","circuit":{"cols":[["Z","•","◦","•","•"]]}}]
};
const teleportLink = {
    "cols":[
        [1,"H"],
        [1,"•",1,1,"X"],
        ["…","…",1,1,"…"],
        ["…","…",1,1,"…"],
        ["~87lj"],
        ["Bloch"],
        ["•","X"],
        ["H"],
        ["Measure","Measure"],
        [1,"•",1,1,"X"],
        ["•",1,1,1,"Z"],
        [1,1,1,1,"Bloch"],
        [1,1,1,1,"~f7c0"]
    ],
    "gates":[
        {"id":"~87lj","name":"message","circuit":{"cols":[["e^-iYt"],["X^t"]]}},
        {"id":"~f7c0","name":"received","matrix":"{{1,0},{0,1}}"}
    ]
};
const eraserLink = {
    "cols": [
        [1,"H"],
        [1,"•",1,1,"X"],
        [1,"~slits","QFT7"],
        [1,1,"Measure","Measure","Measure","Measure","Measure","Measure","Measure"],
        ["…","…","Chance7"],
        ["…","…"],
        ["…","…"],
        ["…","…"],
        ["H"],
        ["Measure"],
        ["~choice"],
        ["•","X^½"],
        [1,"Measure"],
        [1,"~result",1,1,1,"~flat"],
        ["◦","◦","Chance7"],
        ["◦","•","Chance7"],
        [1,1,1,1,1,"~waves"],
        ["•","◦","Chance7"],
        ["•","•","Chance7"]
    ],
    "gates": [
        {"id":"~choice","name":"choice","matrix":"{{1,0},{0,1}}"},
        {"id":"~result","name":"result","matrix":"{{1,0},{0,1}}"},
        {"id":"~flat","name":"flat","matrix":"{{1,0},{0,1}}"},
        {"id":"~waves","name":"waves","matrix":"{{1,0},{0,1}}"},
        {"id":"~slits","name":"slits","matrix":"{{1,0},{0,1}}"}
    ]
};
const chshTestLink = {
    "cols": [
        ["H"],
        ["◦",1,1,1,"X"],
        ["X^-¼"],
        ["…","…","…","…","…"],
        ["~da85","~5s2n",1,"~5s2n","~ahov"],
        [1,"H",1,"H"],
        [1,"Measure",1,"Measure"],
        ["X^½","•"],
        [1,1,1,"•","X^½"],
        ["Measure",1,1,1,"Measure"],
        ["…","…","…","…","…"],
        [1,"•","X","•"],
        ["•",1,"X"],
        [1,1,"X",1,"•"],
        [1,1,"Chance"],
        [1,1,"~q6e"]
    ],
    "gates": [
        {"id":"~da85","name":"Alice","matrix":"{{1,0},{0,1}}"},
        {"id":"~ahov","name":"Bob","matrix":"{{1,0},{0,1}}"},
        {"id":"~5s2n","name":"Referee","matrix":"{{1,0},{0,1}}"},
        {"id":"~q6e","name":"Win?","matrix":"{{1,0},{0,1}}"}
    ]
};
const additionLink = {"cols":[
    ["Counting5",1,1,1,1,1,1,1,"X"],
    ["Chance5",1,1,1,1,"Chance5"],
    ["X","X","X","X","•","X","X","X","X","X"],
    [1,1,1,1,"•","X"],
    ["Swap",1,1,1,"Swap","•"],
    [1,1,1,1,"•",1,"X"],
    [1,"Swap",1,1,"Swap",1,"•"],
    [1,1,1,1,"•",1,1,"X"],
    [1,1,"Swap",1,"Swap",1,1,"•"],
    [1,1,1,1,"•",1,1,1,"X"],
    [1,1,1,"Swap","Swap",1,1,1,"•"],
    [1,1,1,1,"•",1,1,1,1,"X"],
    [1,1,1,"Swap","Swap",1,1,1,"•"],
    [1,1,1,"•",1,1,1,1,"X"],
    [1,1,"Swap",1,"Swap",1,1,"•"],
    [1,1,"•",1,1,1,1,"X"],
    [1,"Swap",1,1,"Swap",1,"•"],
    [1,"•",1,1,1,1,"X"],
    ["Swap",1,1,1,"Swap","•"],
    ["•",1,1,1,1,"X"],
    ["X","X","X","X","•","X","X","X","X","X"],
    ["Chance5",1,1,1,1,"Chance5"]
]};
const qftLink = {"cols":[
    ["Counting8"],
    ["Chance8"],
    ["…","…","…","…","…","…","…","…"],
    ["Swap",1,1,1,1,1,1,"Swap"],
    [1,"Swap",1,1,1,1,"Swap"],
    [1,1,"Swap",1,1,"Swap"],
    [1,1,1,"Swap","Swap"],
    ["H"],
    ["Z^½","•"],
    [1,"H"],
    ["Z^¼","Z^½","•"],
    [1,1,"H"],
    ["Z^⅛","Z^¼","Z^½","•"],
    [1,1,1,"H"],
    ["Z^⅟₁₆","Z^⅛","Z^¼","Z^½","•"],
    [1,1,1,1,"H"],
    ["Z^⅟₃₂","Z^⅟₁₆","Z^⅛","Z^¼","Z^½","•"],
    [1,1,1,1,1,"H"],
    ["Z^⅟₆₄","Z^⅟₃₂","Z^⅟₁₆","Z^⅛","Z^¼","Z^½","•"],
    [1,1,1,1,1,1,"H"],
    ["Z^⅟₁₂₈","Z^⅟₆₄","Z^⅟₃₂","Z^⅟₁₆","Z^⅛","Z^¼","Z^½","•"],
    [1,1,1,1,1,1,1,"H"]
]};
const superdenseCodingLink = {
    "cols":[
        [1,1,"H"],
        [1,1,"•",1,1,1,"X"],
        ["…","…","…","…","…","…","…"],
        ["Counting2"],
        ["Measure","Measure"],
        ["~msg"],
        ["Chance","Chance"],
        ["~enc"],
        [1,"•","X"],
        ["•",1,"Z"],
        [1,1,1,"~send"],
        [1,1,"Swap",1,1,"Swap"],
        [1,1,1,1,1,"~dec"],
        [1,1,1,1,1,"•","X"],
        [1,1,1,1,1,"H"],
        [1,1,1,1,1,"Measure","Measure"],
        [1,1,1,1,1,"~msg"],
        [1,1,1,1,1,"Chance","Chance"],
    ],
    "gates":[
        {"id":"~msg","name":"message","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~enc","name":"encode","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~send","name":"send","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~dec","name":"decode","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
    ]
};
const symmetryBreakingLink = {
    "cols":[
        ["~tpqg",1,"~r2ku"],
        ["…","…","…","…"],
        ["H"],
        [1,1,"H"],
        ["•","X"],
        [1,1,"•","X"],
        [1,"Swap",1,"Swap"],
        ["•","X"],
        [1,1,"•","X"],
        ["X^½","◦"],
        [1,1,"X^½","◦"],
        [1,"X^½"],
        [1,1,1,"X^½"],
        ["Measure","Measure","Measure","Measure"],
        [1,"~57au"],
        ["•",1,"Chance"],
        [1,"•",1,"Chance"],
        ["◦",1,"Chance"],
        [1,"◦",1,"Chance"]
    ],
    "gates": [
        {"id":"~tpqg","name":"Alice^1","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~r2ku","name":"Alice^2","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~57au","name":"disagree","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"}
    ]
};
const shorLink = {
    "cols":[
        [1,1,1,1,1,1,1,1,1,1,"~input",1,1,1,"~guess"],
        [1,1,1,1,1,1,1,1,1,1,{"id":"setR","arg":55},1,1,1,{"id":"setB","arg":26}],
        [],
        ["H","H","H","H","H","H","H","H","H","H","X"],
        ["inputA10",1,1,1,1,1,1,1,1,1,"*BToAmodR6"],
        ["QFT†10"],
        [1,1,1,1,"~out"],
        ["Chance10"],
    ],
    "gates":[
        {"id":"~guess","name":"guess:","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~input","name":"input:","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"},
        {"id":"~out","name":"out:","matrix":"{{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}}"}
    ]
};
const distillLink = {
    "cols":[
        ["H","H","H","H","H"],
        [1,"Z","Z","Z",1,"⊖"],
        [1,"Z","Z",1,"Z",1,"⊖"],
        [1,"Z",1,"Z","Z",1,1,"⊖"],
        [1,1,"Z","Z","Z",1,1,1,"⊖"],
        ["Z","Z","Z","Z","Z",1,1,1,1,"⊖"],
        ["Z",1,1,"Z","Z",1,1,1,1,1,"⊖"],
        ["Z",1,"Z",1,"Z",1,1,1,1,1,1,"⊖"],
        ["Z","Z",1,1,"Z",1,1,1,1,1,1,1,"⊖"],
        ["Z",1,"Z","Z",1,1,1,1,1,1,1,1,1,"⊖"],
        ["Z","Z",1,"Z",1,1,1,1,1,1,1,1,1,1,"⊖"],
        ["Z","Z","Z",1,1,1,1,1,1,1,1,1,1,1,1,"⊖"],
        [1,"Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼","Z^¼"],
        [1,"H","H","H","H","H","H","H","H","H","H","H","H","H","H","H"],
        [1,"Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure","Measure"],
        [1,"X","X","X",1,"•"],
        [1,"X","X",1,"X",1,"•"],
        [1,"X",1,"X","X",1,1,"•"],
        [1,1,"X","X","X",1,1,1,"•"],
        ["Z","X","X","X","X",1,1,1,1,"•"],
        ["Z",1,1,"X","X",1,1,1,1,1,"•"],
        ["Z",1,"X",1,"X",1,1,1,1,1,1,"•"],
        ["Z","X",1,1,"X",1,1,1,1,1,1,1,"•"],
        ["Z",1,"X","X",1,1,1,1,1,1,1,1,1,"•"],
        ["Z","X",1,"X",1,1,1,1,1,1,1,1,1,1,"•"],
        ["Z","X","X",1,1,1,1,1,1,1,1,1,1,1,1,"•"],
        ["X","Chance4"],
        ["Amps1","|0⟩⟨0|","|0⟩⟨0|","|0⟩⟨0|","|0⟩⟨0|"]
    ]
};
const schrodingerLink = {
    "cols": [
        ["H"],
        ["•","X"],
        [1,"•","X"],
        [1,1,"•","X"],
        [1,1,1,"•","X"],
        [1,1,1,1,"•","X"]
    ]
};

const eprPairDetailedLink = {
    "cols":[
        ["Bloch","Bloch"],
        ["H"],
        ["Bloch","Bloch"],
        ["•","X"],
        ["Bloch","Bloch"],
        ["Density2"],
        [],
        ["Measure"],
        ["Density2"],
        [],
        ["Chance2"],
        ["Bloch","Bloch"]
    ]
};

const eprPairLink = {
    "cols":[
        ["H",1],
        ["•","X"]
    ],
    "gates":[]
};

const ccnotToffoliLink = {
    "cols":[
        ["•","•","X"]
    ]
};

const ccnotToffoliDecompositionLink = {
    "cols":[
        [1,1,"H"],
        [1,"•","Z^½"],
        ["•","X",1],
        [1,"•","Z^½"],
        [1,"•","Z^½"],
        [1,"•","Z^½"],
        ["•","X",1],
        ["•",1,"Z^½"],
        [1,1,"H"]
    ],
    "gates":[]
};

const TwoQubitQftLink = {
    "cols":[
        ["H",1],
        ["Z^½","•"],
        [1,"H"],
        ["Swap","Swap"]
    ],
    "gates":[]
};

const ThreeQubitQftLink = {
    "cols":[
        ["H"],
        ["Z^½","•"],
        ["Z^¼",1,"•"],
        [1,"H"],
        [1,"Z^½","•"],
        [1,1,"H"],
        ["Swap",1,"Swap"]
    ]
};

const FourQubitQftLink = {
    "cols":[
        ["H",1,1,1],
        ["Z^½","•",1,1],
        ["Z^¼",1,"•",1],
        ["Z^⅛",1,1,"•"],
        [1,"H",1,1],
        [1,"Z^½","•",1],
        [1,"Z^¼",1,"•"],
        [1,1,"H",1],
        [1,1,"Z^½","•"],
        [1,1,1,"H"],
        [1,"Swap","Swap",1],
        ["Swap",1,1,"Swap"]
    ],
    "gates":[]
};

const RightShiftLink = {
    "cols":[
        ["•","•","•","•","X"],
        ["•","•","•","X"],
        ["•","•","X"],
        ["•","X"],
        ["X"]
    ]
};

const LeftShiftLink = {
    "cols":[
        ["◦","◦","◦","◦","X"],
        ["◦","◦","◦","X"],
        ["◦","◦","X"],
        ["◦","X"],
        ["X"]
    ]
};

const OptimizedState5QubitsLink = {
    "cols":[
        ["•",1,1,1,1,"X"],
        [1,1,1,1,"•","X"],
        ["Slicer6"],
        [1,"X",1,1,1,"•"],
        [1,"X",1,1,"◦","•"],
        [1,1,"X",1,"•","•"],
        [1,"•","•","X",1,"•"],
        [1,1,"X",1,"•","•"],
        [1,"X",1,1,"◦","•"],
        [1,"◦","X",1,"◦","•"],
        [1,"•","X",1,"•","•"],
        ["Slicer6"],
        ["X"],
        ["Slicer6"],
        [1,1,1,1,"•","X"],
        ["•",1,1,1,1,"X"],
        [1,1,1,1,1,"X"],
        ["Slicer6"]
    ]
};

const OptimizedState6QubitsLink = {
    "cols":[
        ["•",1,1,1,1,1,"X"],
        [1,1,1,1,1,"•","X"],
        ["Slicer7"],
        [1,"X",1,1,1,1,"•"],
        [1,"X",1,1,1,"◦","•"],
        [1,1,"X",1,1,"•","•"],
        [1,"•","•","X",1,1,"•"],
        [1,1,"X",1,1,"•","•"],
        [1,"X",1,1,1,"◦","•"],
        [1,"◦","X",1,1,"◦","•"],
        [1,"•","X",1,1,"•","•"],
        ["Slicer7"],
        ["X"],
        ["Slicer7"],
        ["X",1,1,1,1,"◦"],
        [1,"X",1,1,1,"◦"],
        [1,1,"X",1,1,"◦"],
        [1,1,1,"X",1,"◦"],
        ["•","•","•","•","X"],
        [1,1,1,"X",1,"◦"],
        [1,1,"X",1,1,"◦"],
        [1,"X",1,1,1,"◦"],
        ["X",1,1,1,1,"◦"],
        ["Slicer7"],
        [1,1,1,1,1,"•","X"],
        ["•",1,1,1,1,1,"X"],
        [1,1,1,1,1,1,"X"],
        ["Slicer7"]
    ]
};


/**
 * @param {!Revision} revision
 * @param {!Observable.<!boolean>} obsIsAnyOverlayShowing
 */
function initGallery(revision, obsIsAnyOverlayShowing) {
    // Show/hide menu overlay.
    (() => {
        const menuButton = /** @type {!HTMLButtonElement} */ document.getElementById('circuits-button');
        const closeMenuButton = /** @type {!HTMLButtonElement} */ document.getElementById('close-circuits-button');
        const menuOverlay = /** @type {!HTMLDivElement} */ document.getElementById('circuits-overlay');
        const menutDiv = /** @type {HTMLDivElement} */ document.getElementById('circuits-div');
        menuButton.addEventListener('click', () => galleryIsVisible.set(true));
        obsIsAnyOverlayShowing.subscribe(e => { menuButton.disabled = e; });
        menuOverlay.addEventListener('click', () => galleryIsVisible.set(false));
        closeMenuButton.addEventListener('click', () => galleryIsVisible.set(false));
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                galleryIsVisible.set(false)
            }
        });
        obsGalleryIsShowing.subscribe(showing => {
            menutDiv.style.display = showing ? 'block' : 'none';
            if (showing) {
                document.getElementById('export-link-copy-button').focus();
            }
        });
    })();

    const groverAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-anchor-grover');
    const teleportAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-anchor-teleport');
    const eraserAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-anchor-delayed-eraser');
    const additionAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-addition');
    const superdenseCodeAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-superdense-coding');
    const symmetryBreakAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-symmetry-break');
    const chshTestAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-chsh-test');
    const qftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-qft');
    const shorAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-anchor-shor');
    const distillAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-anchor-distill');
    const schrodingerAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-schrodingers-cat');
    const eprPairDetailedAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-epr-pair-detailed');
    const eprPairAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-epr-pair');
    const ccnotAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-ccnot');
    const ccnotDecompositionAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-ccnot-decomposition');
    const twoQubitQftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-two-qubit-qft');
    const threeQubitQftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-three-qubit-qft');
    const fourQubitQftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-four-qubit-qft');
    const rightShiftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-right-shift');
    const leftShiftAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-left-shift');
    const optimizedState5QubitsAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-optimized-state-5-qubits');
    const optimizedState6QubitsAnchor = /** @type {!HTMLAnchorElement} */ document.getElementById('example-optimized-state-6-qubits');

    for (let [a, t] of [[groverAnchor, groverLink],
                        [shorAnchor, shorLink],
                        [teleportAnchor, teleportLink],
                        [eraserAnchor, eraserLink],
                        [additionAnchor, additionLink],
                        [superdenseCodeAnchor, superdenseCodingLink],
                        [symmetryBreakAnchor, symmetryBreakingLink],
                        [chshTestAnchor, chshTestLink],
                        [qftAnchor, qftLink],
                        [distillAnchor, distillLink],
                        [schrodingerAnchor, schrodingerLink],
                        [eprPairDetailedAnchor, eprPairDetailedLink],
                        [eprPairAnchor, eprPairLink],
                        [ccnotAnchor, ccnotToffoliLink],
                        [ccnotDecompositionAnchor, ccnotToffoliDecompositionLink],
                        [twoQubitQftAnchor, TwoQubitQftLink],
                        [threeQubitQftAnchor, ThreeQubitQftLink],
                        [fourQubitQftAnchor, FourQubitQftLink],
                        [rightShiftAnchor, RightShiftLink],
                        [leftShiftAnchor, LeftShiftLink],
                        [optimizedState5QubitsAnchor, OptimizedState5QubitsLink],
                        [optimizedState6QubitsAnchor, OptimizedState6QubitsLink]]) {
        let text = JSON.stringify(t);
        a.href = "#circuit=" + text;
        a.onclick = ev => {
            // Urgh, this is terrible but it will have to do.
            if (ev.shiftKey || ev.ctrlKey || ev.altKey || ev.which !== 1) {
                return undefined;
            }

            revision.commit(text);
            galleryIsVisible.set(false);
            return false;
        };
    }
}

export {initGallery as initGallery, obsGalleryIsShowing as obsGalleryIsShowing, closeGallery as closeGallery}
