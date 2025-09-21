/*
9. JSON Schema Validator (Advanced)

Write a validator function validate(schema: Schema, obj: any): boolean where schema defines required fields and types:
*/

function testExpectSchema<T>(test: T, expect: T, desc: string) {
    if (test === expect) {
        console.log("Pass: " + desc)
    } else {
        console.log("Fail: " + desc)
    }
}

type Schema = {
  [key: string]: "string" | "number" | "boolean";
};

// validate flat / simple json
function validate(schema: Schema, obj: any): boolean {
    try {
        Object.keys(obj).forEach((key) => {
            const objValueType = typeof obj[key]
            const schemaType =  schema[key]
            // console.log(key + " has type: " + objValueType + "; schema has type: " + schemaType)
            if (objValueType != schemaType) {
                // return false doesn't work in forEach - for prod woul
                throw new Error("NOPE: " + key + " has type: " + objValueType + "; schema has type: " + schemaType);
            }
        })
    } catch (e: any) {
        return false
    }
    return true
}

const schema: Schema = { id: "number", name: "string" };
testExpectSchema(validate(schema, { id: 1, name: "Alice" }), true, "Schema matches"); // true
testExpectSchema(validate(schema, { id: "oops", name: "Bob" }), false, "Schema does not match"); // false


