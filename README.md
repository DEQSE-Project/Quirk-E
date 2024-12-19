# Quirk-E
<a href="https://quirk-e.dev/" target="_blank">Quirk-E</a> is an open-source quantum circuit simulator built as an extension of the original Quirk [ [1](https://github.com/Strilanc/Quirk) ] platform. Quirk-E has been developed as part of the <strong>Developer Experience in Iterative Quantum Software Engineering (DEQSE)</strong> project by the <a href="https://www.jyu.fi/en/research-groups/empirical-software-engineering-research" target="_blank">Empirical Software Engineering Research Team</a> and the <a href="https://www.jyu.fi/en/research-groups/quantum-information-and-computation-team" target="_blank">QIC Team</a> at the <a href="https://www.jyu.fi/en" target="_blank">University of Jyväskylä</a>, Finland.

The Quirk-E tool, which has been presented in [ [2] (https://doi.org/) ], adds more functionalities to the Quirk [ [1](https://github.com/Strilanc/Quirk) ] quantum circuit simulator.

The Quirk-E is free to use and modify. However, you must add reference #[ [2] (https://doi.org/) ] in case of any publication.

Quirk-E is also embedded in the DEQSE Visual Studio Code Extension, designed to enhance the quantum software development experience. The extension is available for download from <a href="https://github.com/DEQSE-Project/deqse-vscode-extension" target="_blank">GitHub</a> and <a href="https://marketplace.visualstudio.com/publishers/jyuqicteam" target="_blank">Microsoft Marketplace</a>.

<br>
Access Quirk-E via:

- **Web Browser:** [quirk-e.dev](https://quirk-e.dev/)

- **DEQSE Visual Studio Code Extension:** [GitHub Repository](https://github.com/DEQSE-Project/deqse-vscode-extension) | [Microsoft Marketplace](https://marketplace.visualstudio.com/publishers/jyuqicteam) 

This work has been supported by the Academy of Finland (project DEQSE 349945).

# Features

- **Dependencies have been updated** resolving several vulnerabilities caused by out-of-date packages.
- **Right Click Menu for gates** is added. It has "Duplicate" and "Delete" options.
- **Probability distribution histogram** is added.
- **Output state visualization and copying** is implemented below the histogram.
- **Dark and light modes** are added for enhancing the developer experience. These settings can be changed in the **UI Settings menu**.
- **Multi-colored, yellow-colored, and black & white UI coloring options** are available to take into account different user needs and use cases. These settings can be changed in the **UI Settings menu**.
- **UI enhancements** are made in order to make developer experience better.
- **Drag and Drop Barrier (Slicer)** for quantum circuits, enabling precise control over circuit execution flow by defining explicit synchronization points.

![Added features showed in light, multi-colored UI](https://github.com/DEQSE-Project/Quirk-E/blob/main/quirk-e-light.jpg)

![Additional added features showed in dark, yellow-colored UI](https://github.com/DEQSE-Project/Quirk-E/blob/main/quirk-e-dark.jpg)

# Known issues

- **Some vulnerable dependencies** still remain due to some developer dependencies having vulnerable versions of `lodash` and `traceur` as sub-dependencies.

# Installation

Clone the repository.

`git clone https://github.com/DEQSE-Project/Quirk-E` 

`cd Quirk-E`

`npm install`

`npm run`

`npm run build`

Confirm the output works by opening out/quirk.html with a web browser.

# Contributors

- Ronja Heikkinen ([@ronjahoo](https://github.com/ronjahoo)), *University of Jyväskylä*
- Samuel Ovaskainen ([@0wsk](https://github.com/0wsk)), *University of Jyväskylä*
- Majid Haghparast ([@MajidHaghparast](https://github.com/MajidHaghparast)), *University of Jyväskylä*

# Contact

Majid Haghparast <<majid.m.haghparast@jyu.fi>>

# References

[1] https://github.com/Strilanc/Quirk

[2] https://doi.org/ (WILL BE UPDATED)


