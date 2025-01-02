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

const menuIsVisible = new ObservableValue(true);
const obsMenuIsShowing = menuIsVisible.observable().whenDifferent();
let closeMenu = () => menuIsVisible.set(false);

/**
 * @param {!Revision} revision
 * @param {!Observable.<!boolean>} obsIsAnyOverlayShowing
 */
function initMenu(revision, obsIsAnyOverlayShowing) {
    // Show/hide menu overlay.
    (() => {
        const menuButton = /** @type {!HTMLButtonElement} */ document.getElementById('menu-button');
        const closeMenuButton = /** @type {!HTMLButtonElement} */ document.getElementById('close-menu-button');
        const menuOverlay = /** @type {!HTMLDivElement} */ document.getElementById('menu-overlay');
        const menutDiv = /** @type {HTMLDivElement} */ document.getElementById('menu-div');
        menuButton.addEventListener('click', () => menuIsVisible.set(true));
        obsIsAnyOverlayShowing.subscribe(e => { menuButton.disabled = e; });
        menuOverlay.addEventListener('click', () => menuIsVisible.set(false));
        closeMenuButton.addEventListener('click', () => menuIsVisible.set(false));
        document.addEventListener('keydown', e => {
            const ESC_KEY = 27;
            if (e.keyCode === ESC_KEY) {
                menuIsVisible.set(false)
            }
        });
        obsMenuIsShowing.subscribe(showing => {
            menutDiv.style.display = showing ? 'block' : 'none';
            if (showing) {
                document.getElementById('export-link-copy-button').focus();
            }
        });
    })();
}

export {initMenu, obsMenuIsShowing, closeMenu}
