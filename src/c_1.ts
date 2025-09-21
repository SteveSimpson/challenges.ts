function testExpect<T>(test: T, expect: T, desc: string) {
    if (test === expect) {
        console.log("Pass: " + desc)
    } else {
        console.log("Fail:  " + desc)
    }
}

function isPalindrome(str: string): boolean {
    const baseString = str.replaceAll(' ', '').toLowerCase();
    const revString = baseString.split('').reverse().join('');

    return baseString === revString
}

testExpect(isPalindrome("M om"), true, "'M om' is a Palindrom")
testExpect(isPalindrome("man"), false, "'man' is not a Palindrom")
