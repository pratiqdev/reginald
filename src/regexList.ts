const regexList = {
    markdown: {
        standard_link: /[^!]\[.*?\]\(.*?\)/g,           // - []()
        inline_link: /[^!]\[.*?\]\[.*?\]/g,        // - [][]
        reference_link: /[^!]\[.*?\]: .*?\S*/g,      // - []: http://
        malformed_link: /[^!]\[.*?\]\(.*?\)/g,           // - []()
        standard_image: /!\[.*?\]\(.*?\)/g,    // - ![]()
        reference_image: /!\[.*?\]\[.*?\]/g,   // - ![][]
    },
    

}

export default regexList