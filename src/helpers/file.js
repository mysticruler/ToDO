export function validateFile(file,{types=[],maxBytes=Infinity}={}){if(!file)return "Choose a file first.";if(types.length&&!types.includes(file.type))return "That file type is not supported.";if(file.size>maxBytes)return `That file is too large. Maximum size is ${Math.round(maxBytes/1024/1024)} MB.`;return ""}
export function readFileAsArrayBuffer(file){return file.arrayBuffer()}
