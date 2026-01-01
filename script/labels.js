
const structureUseLabel = {  // autocasts as new LabelClass()
    symbol: {
        type: "label-3d", // autocasts as new LabelSymbol3D()
        symbolLayers: [{
            type: "text", // autocasts as new TextSymbol3DLayer()
            material: { color: "#402e32"},
            background: {
                color: [236, 232, 221, 0.3]
            },
            // halo: {
            //     color: [255,255,255,1],
            //     size: 1
            // },
            font: {  // autocasts as new Font()
                family: "Lato",
                weight: "bold"
            },
            size: 9
            }],
            verticalOffset: {
                screenLength: 5,
                maxWorldLength: 10,
                minWorldLength: 5
            },
            callout: {
                type: "line", 
                size: 0,
                color: [0, 0, 0],
                border: {
                    color: [255, 255, 255, 0]
                }
            }
        },
        minScale: 2500, 
        maxScale: 0,
        // labelPlacement: "above-center",
        // labelExpressionInfo: {
        //     expression: 'if (!IsEmpty($feature.name) && $feature.name != "Toilet" && $feature.name != "Other") return $feature.name'
        // }
        labelExpressionInfo: {
            value: "{Name_Disp}"
            
        }
};


const newDealLabel = {  // autocasts as new LabelClass()
    symbol: {
        type: "label-3d", // autocasts as new LabelSymbol3D()
        symbolLayers: [{
            type: "text", // autocasts as new TextSymbol3DLayer()
            material: { color: "#402e32"},
            background: {
                color: [236, 232, 221, 0.5]
            },
            // halo: {
            //     color: [255,255,255,1],
            //     size: 1
            // },
            font: {  // autocasts as new Font()
                family: "Lato",
                weight: "bold"
            },
            size: 9
            }],
            verticalOffset: {
                screenLength: 30,
                maxWorldLength: 30,
                minWorldLength: 20
            },
            callout: {
                type: "line", 
                size: 1,
                color: [0, 0, 0],
                border: {
                    color: [255, 255, 255, 0]
                }
            }
    },
    minScale: 2500, 
    maxScale: 0,
    // labelPlacement: "above-center",
    labelExpressionInfo: {
        value: "{Name} {Details}"
        
    }
};