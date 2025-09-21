/*
5. CSV Parser (Intermediate)

Write a function parseCSV(input: string): string[][] that converts CSV text into a 2D array.
- Handle quoted fields ("Hello, World").
- Handle newlines.
*/


const csv1 = `a,b,c,d,e
f,g,h,i,j
k,l,m,n,o`

const csv2 = `a,b,c,d,e
f,g,h,i,"just, 
kidding"
k,l,m,n,o`

function parseCSV(csv:string): string[][] {
    const quoteCharacters = ["'", '"']

    var output: string[][] = [];

    let row = 0;
    let column = 0;
    let quoteChar = ""


    output[0] = []

    output[0][0] = "";

    // normalize CSV linefeeds
    // probably should look at calling os specific library as well
    csv = csv.replaceAll("\r\n","\n");

    // implemntation to allow for stream (in future) and processing quoted fields)
    // this is fine for sample (small) input, would probably want some sort stream input for large data / files
    csv.split('').forEach(char => {
        // we are in a quoted string
        if (quoteChar != "") {
            if (char == quoteChar) {
                // this is the end of the quoted string
                quoteChar = "";
            } else {
                // we are in a quoted string, just add the char and move on
                output[row][column] = output[row][column] + char;
            }
            return;
        }

        // start a quoted string
        if (quoteCharacters.includes(char)) {
            quoteChar = char;
            return;
        }

        if (char == ",") {
            // advance column
            column++;
            output[row][column] = "";
        } else if (char == "\n") {
            // advance row
            row++;
            column = 0;
            output[row] = [];
            output[row][column] = "";
        } else {
            output[row][column] = output[row][column] + char;
        }
    })

    return output;
}

console.log(parseCSV(csv1));

console.log(parseCSV(csv2));
