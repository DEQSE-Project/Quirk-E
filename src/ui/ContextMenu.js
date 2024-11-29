import { Revision } from "../base/Revision.js";

class ContextMenu {
    /* 
    Controls context menu you get when right clicking on placed gates.
    Implemented in HTML due to canvas having no built in method to
    prevent event prograpation.
    */
    constructor(inspector, revision, syncArea) {
        /** @type {HTMLElement} */
        this.menuDiv = document.getElementById("gate-context-menu");
        /** @type {HTMLElement} */
        this.canvas = document.getElementById("drawCanvas");
        /** @type {ObservableValue.<!DisplayedInspector>} */
        this.displayedInspector = inspector;
        /** @type {Revision} */
        this.revision = revision;
        /** @type {Point} */
        this.position = undefined;
        this.syncArea = syncArea;
        
        document.getElementById("delete-gate-button")
            .addEventListener("click", () => this.deleteGate());
        document.getElementById("duplicate-gate-button")
            .addEventListener("click", () => this.duplicateGate());
    }
    
    /**
     * @param {Point} position
     */
    open(position) {
        this.position = position;
        const {x, y} = position;
        this.menuDiv.style.top = `${y + 50}px`;
        this.menuDiv.style.left = `${x}px`;
        this.menuDiv.style.display = "block";
    }
    
    close() {
        this.menuDiv.style.display = "none";
        this.position = undefined;
    }
    
    _newHand() {
        return this.displayedInspector.get().hand.withPos(this.position); 
    }
    
    deleteGate() {
        let newHand = this._newHand();
        let newInspector = this.displayedInspector.get()
            .withHand(newHand)
            .afterGrabbing(false, false, true, false) // Grab the gate.
            .withHand(newHand) // override hand so it's not grabbing anything
            .afterTidyingUp()
            .withJustEnoughWires(newHand, 0);
        this.revision.commit(newInspector.snapshot()); 
        this.close();
    }
    
    duplicateGate() {
        let newInspector = this.displayedInspector.get()
            .withHand(this._newHand())
            .afterGrabbing(true, false, true, false) // grab gate with duplicate on
            .afterDropping() // drop on the same column & row
            .afterTidyingUp();
        this.revision.commit(newInspector.snapshot());
        this.close();
    }
}

export {ContextMenu};