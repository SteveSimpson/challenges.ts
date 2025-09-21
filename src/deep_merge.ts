function deepMerge<T extends object, U extends object>(obj1: T, obj2: U): any {
    let output: any = obj1; // make a copy for the output
    const valueTypes = ["boolean", "string", "number"]

    Object.keys(obj2).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(obj1, key) == false) {
            // this is a key unique to object 2, so we can just add it
            output[key] = obj2[key as keyof U]
        } else {
            // since we are replacing obj1's key, we want to see if it is a value
            // & don't really care about the type we are replacing it with
            const valueType = typeof obj1[key as keyof T]
            if (valueTypes.includes(valueType)) {
                output[key] = obj2[key as keyof U]

            } else if (Array.isArray(obj1[key as keyof T]) && Array.isArray(obj2[key as keyof U])) {
                // deep merge of tags didn't come out as desired
                // spec didn't cover exactly the desired output, but I think comining the tags probably makes the most sense

                const starter: any[]= []
                const mergedArray = starter.concat(obj1[key as keyof T]).concat(obj2[key as keyof U])

                output[key] = mergedArray
            } else {
                // now we need to dive back into the object
                output[key] = deepMerge(obj1[key as keyof T] as object, obj2[key as keyof U] as object)
            }
        }
        
    })
    
    
    return output;

}

const obj1 = {
  id: 1,
  name: "Alice",
  settings: {
    theme: "light",
    notifications: {
      email: true,
      sms: false,
    },
  },
  tags: ["user", "beta"],
};

const obj2 = {
  name: "Alice Smith",
  settings: {
    theme: "dark",
    notifications: {
      sms: true,
    },
  },
  tags: ["vip"],
  role: "admin",
};

console.log(deepMerge(obj1, obj2));

