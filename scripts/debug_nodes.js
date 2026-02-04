import { parse } from 'mathjs';

const equations = [
    "x^2 + y^2 - 25", // Implicit circle? Or 3D surface z = ...?
    "x + y", // Plane?
    "2x^2 + 3x - 5", // Quadratic
    "sin(x)",
    "x^2 + y^2 = 25", // Circle
];

equations.forEach(eq => {
    console.log(`\n--- Equation: ${eq} ---`);
    try {
        const node = parse(eq);
        console.log("Type:", node.type);
        // console.log(JSON.stringify(node, null, 2)); 

        if (node.type === 'OperatorNode') {
            console.log("Op:", node.op);
            console.log("Args:", node.args.map(a => a.type));
        }
    } catch (e) {
        console.error(e.message);
    }
});
