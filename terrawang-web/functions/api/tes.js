const onnx = require("onnxruntime-node");

const fs = require("fs");

// Load the ONNX model
const modelData = fs.readFileSync("model.onnx");
const session = new onnx.InferenceSession(modelData);

// Define input data (adjust based on your model's input requirements)
const inputData = new Float32Array([1, 2, 3, 4, 5]); // Example input data

// Create input tensor
const inputTensor = new onnx.Tensor("float32", new Float32Array(inputData), [
  1,
  inputData.length,
]);

// Assuming you have some code that sets the value of 'outputMap'
let outputMap;

// Check if 'outputMap' is defined and has the expected structure
if (outputMap && outputMap.outputs && outputMap.outputs.length > 0) {
  const outputTensor = outputMap.outputs[0];
  // Continue with the rest of your code that uses 'outputTensor'
  console.log("Output Tensor:", outputTensor);
} else {
  console.error("Error: Invalid 'outputMap' or missing 'outputs'");
  // Handle the error or return an appropriate response
}

// ... Rest of your code

// Run inference
// outputMap = session.run([inputTensor]);

// // Extract and print the output
// const outputTensor = outputMap.outputs[0]; // Access the first (and possibly only) output tensor
// const outputData = outputTensor.data || outputTensor.floatData; // Use floatData if data is undefined
// console.log("Model prediction:", outputData);
