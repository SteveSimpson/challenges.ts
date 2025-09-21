interface User {
  id: number;
  name: string;
  email: string;
}

// function valid(someObject: any): boolean {
//     const testUser: User = {
//         id: 1,
//         name: "name",
//         email: "email"
//     }

//     // loop through all fields and their types
//     try {
//         Object.keys(testUser).forEach((key) => {
//             if (Object.prototype.hasOwnProperty.call(someObject, key) == false) {
//                 const message = "Does not have property of " + key
//                 console.log(message);
//                 throw new Error(message);
//             }
//             const baseType = typeof testUser[key as keyof User]
//             if ((typeof someObject[key]) != baseType)  {
//                 const message = "Property, " + key + ", does not have correct type of " + baseType
//                 console.log(message);
//                 throw new Error(message);
//             }
//         })
//     } catch (e: any) {
//         return false
//     }

//     // now specific test
//     if (someObject.email.includes("@") === false) {
//         return false
//     }

//     return true;
// }

function transformUsers(data: any[]): User[] {
    //let validUsers: User[] = []

    // data.forEach((item) => {
    //     if (valid(item)) {
    //         const cleanItem: User = {
    //             id: item.id,
    //             name: item.name,
    //             email: item.email,
    //         }

    //         validUsers.push(cleanItem)
    //     }
    // })


    //return validUsers;
    return data.filter((item): item is User => {
    return (
      typeof item.id === "number" &&
      typeof item.name === "string" &&
      typeof item.email === "string" &&
      item.email.includes("@")
    );
  });
}

// Example input
const rawData = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { name: "Bob" }, // missing id and email
  { id: 3, name: "Charlie", email: "invalid-email" },
  { id: 4, name: "Dana", email: "dana@example.com" },
  { id: 5, name: 1324, email: "dummy@localhost"},
  { id: 6, name: "Extra stuff", email: "extra@example.com", extra: "foobar"}
];

console.log(transformUsers(rawData));
// Expected Output:
// [
//   { id: 1, name: "Alice", email: "alice@example.com" },
//   { id: 4, name: "Dana", email: "dana@example.com" }
// ]
