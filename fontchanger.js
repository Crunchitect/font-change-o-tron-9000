const ignore = (f, ...args) => { try { f.call(...args) } catch {} };

const FontChangerOTron9000 = new Proxy(
    {
        parentQ: 'body',
        notResizeQ: '.not-resize',
        resizeQ: 'body *:not(.not-resize)',
        fontChangeQ: '.fontSize',
        fontSetQ: '.fontSet',
        fontResetQ: '.resetSize',
        anime: true,
        // animePath: './anime.js',
        sizeTo(size) {
            if (this.anime) {
                anime({
                    targets: this.resizeQ,
                    zoom: size,
                    duration: 100,
                    easing: 'cubicBezier(.5, .05, .1, .3)'
                });
            } else {
                document.querySelectorAll(this.resizeQ).forEach(i => {
                    i.style.setProperty('zoom', size);
                });
            }
        },
        reset() {
            this.sizeTo('unset');
        },
        changeBy(size) {
            this.sizeTo(
                (parseFloat(document.querySelector(this.resizeQ).style.zoom) || 1) + parseFloat(size)
            );
        },
        // T    A   B   S
        doIt() {
            ignore(() => {
                document.querySelectorAll(this.fontChangeQ).forEach(el => {
                    el.addEventListener('click', () => {
                        this.sizeTo(
                                (parseFloat(document.querySelector(this.resizeQ).style.zoom) || 1) + parseFloat(el.value)
                            );
                        });
                    });
                }
            );
            
            ignore(() => {
                document.querySelectorAll(this.fontSetQ).forEach(el => {
                    el.addEventListener('click', () => {
                        this.sizeTo(
                            parseFloat(el.value) || 1
                        );
                    });
                });
            });
            
            ignore(() => {
                document.querySelector(this.fontResetQ).addEventListener('click', () => {
                    this.sizeTo('unset');
                });
            });
        }
    },
    {
        set(target, prop, value) {
            target[prop] = value;
            target.resizeQ = `${target.parentQ} *:not(${target.notResizeQ})`;
            target.sizeTo = function (size) {
                if (this.anime) {
                    anime({
                        targets: this.resizeQ,
                        zoom: size,
                        duration: 100,
                        easing: 'cubicBezier(.5, .05, .1, .3)'
                    });
                } else {
                    document.querySelectorAll(this.resizeQ).forEach(i => {
                        i.style.setProperty('zoom', size);
                    });
                }
            };
            target.doIt = function () {
                ignore(() => {
                    document.querySelectorAll(this.fontChangeQ).forEach(el => {
                        el.addEventListener('click', () => {
                            target.sizeTo(
                                (parseFloat(document.querySelector(this.resizeQ)?.style?.zoom) || 1) + parseFloat(el.value)
                            );
                        });
                    });
                });
                
                ignore(() => {
                    document.querySelectorAll(this.fontSetQ).forEach(el => {
                        el.addEventListener('click', () => {
                            target.sizeTo(
                                parseFloat(el.value) || 1
                            );
                        });
                    });
                });
                
                ignore(() => {
                    document.querySelector(this.fontResetQ).addEventListener('click', () => {
                        target.sizeTo(this.anime ? 1 : "unset");
                    });
                });
            };
            return target[prop] == value;
        }
    }
);

document.querySelector('font-changer-o-tron-9000').outerHTML = `
<button class="fontSize  not-resize" type="button" value="-0.3">A-</button>
<button class="fontSize  not-resize" type="button" value="0.3" >A+</button>
<button class="resetSize not-resize" type="button" value="0.1" >Reset</button>

<button class="fontSet   not-resize" value="1" style="font-size: 0.5rem">A</button>
<button class="fontSet   not-resize" value="2" style="font-size: 0.75rem">A</button>
<button class="fontSet   not-resize" value="3" style="font-size: 1rem">A</button>
`;
