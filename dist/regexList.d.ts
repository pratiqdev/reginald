declare const regexList: {
    markdown: {
        standard_link: RegExp;
        inline_link: RegExp;
        reference_link: RegExp;
        malformed_link: RegExp;
        standard_image: RegExp;
        reference_image: RegExp;
    };
};
export default regexList;
