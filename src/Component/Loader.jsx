import React from 'react'

const Loader = () => {
    return (
        <>
            <div className="loader-wrapper">
                <div className="loader-index"> <span></span></div><svg>
                    <defs></defs>
                    <filter id="goo">
                        <fegaussianblur in="SourceGraphic" stddeviation="11" result="blur"></fegaussianblur>
                        <fecolormatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"> </fecolormatrix>
                    </filter>
                </svg>
            </div>
            <div className="tap-top"><i data-feather="chevrons-up"></i></div>
        </>
    )
}

export default Loader
