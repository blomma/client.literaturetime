/**
    Based on https://github.com/othree/smartypants.js/blob/master/smartypants.ts

    BSD 3-Clause License

    Copyright (c) 2016, othree
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

    * Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

type token = [string, string];

const tags_to_skip = /<(\/?)(?:pre|code|kbd|script|math)[^>]*>/i;
const right_single_quotation_mark = "’";
const left_single_quotation_mark = "‘";
const left_double_quotation_mark = "“";
const right_double_quotation_mark = "”";
const em_dash = "—";
const horizontal_ellipsis = "…";

/**
 * @param text text to be parsed
 */
const SmartyPants = (text: string = ""): string => {
    var tokens: Array<token> = _tokenize(text);
    var result: string = "";
    /**
     * Keep track of when we're inside <pre> or <code> tags.
     */
    var in_pre: number = 0;
    /**
     * This is a cheat, used to get some context
     * for one-character tokens that consist of
     * just a quote char. What we do is remember
     * the last character of the previous text
     * token, to use as context to curl single-
     * character quote tokens correctly.
     */
    var prev_token_last_char: string = "";

    for (let i = 0; i < tokens.length; i++) {
        let cur_token = tokens[i];
        if (cur_token[0] === "tag") {
            result = result + cur_token[1];
            let matched = tags_to_skip.exec(cur_token[1]);
            if (matched) {
                if (matched[1] === "/") {
                    in_pre = 0;
                } else {
                    in_pre = 1;
                }
            }
        } else {
            let t: string = cur_token[1];
            let last_char: string = t.substring(t.length - 1, t.length); // Remember last char of this token before processing.
            if (!in_pre) {
                t = ProcessEscapes(t);

                t = EducateDashes(t);
                t = EducateEllipses(t);
                t = EducateBackticks(t);

                if (t === "'") {
                    // Special case: single-character ' token
                    if (/\S/.test(prev_token_last_char)) {
                        t = right_single_quotation_mark;
                    } else {
                        t = left_single_quotation_mark;
                    }
                } else if (t === '"') {
                    // Special case: single-character " token
                    if (/\S/.test(prev_token_last_char)) {
                        t = right_double_quotation_mark;
                    } else {
                        t = left_double_quotation_mark;
                    }
                } else {
                    // Normal case:
                    t = EducateQuotes(t);
                }
            }
            prev_token_last_char = last_char;
            result = result + t;
        }
    }

    return result;
};

/**
 * @param {string} str String
 * @return {string} The string, with "educated" curly quote HTML entities.
 *
 * Example input:  "Isn't this fun?"
 * Example output: “Isn’t this fun?”
 */
const EducateQuotes = (str: string): string => {
    /**
     * Make our own "punctuation" character class, because the POSIX-style
     * [:PUNCT:] is only available in Perl 5.6 or later:
     *
     * JavaScript don't have punctuation class neither.
     */
    var punct_class = "[!\"#$%'()*+,-./:;<=>?@[\\]^_`{|}~]";

    /**
     * Special case if the very first character is a quote
     * followed by punctuation at a non-word-break. Close the quotes by brute force:
     */
    str = str.replace(
        new RegExp(`^'(?=${punct_class}\\B)`),
        right_single_quotation_mark
    );
    str = str.replace(
        new RegExp(`^"(?=${punct_class}\\B)`),
        right_double_quotation_mark
    );

    /**
     * Special case for double sets of quotes, e.g.:
     *   <p>He said, "'Quoted' words in a larger quote."</p>
     */
    str = str.replace(
        /"'(?=\w)/,
        left_double_quotation_mark + left_single_quotation_mark
    );
    str = str.replace(
        /'"(?=\w)/,
        left_single_quotation_mark + left_double_quotation_mark
    );

    /**
     * Special case for decade abbreviations (the '80s):
     */
    str = str.replace(/'(?=\d\d)/, right_single_quotation_mark);

    var close_class = "[^\\ \\t\\r\\n\\[\\{\\(\\-]";
    var not_close_class = "[\\ \\t\\r\\n\\[\\{\\(\\-]";
    var dec_dashes = "&#8211;|&#8212;";
    /**
     * Get most opening single quotes:
     * s {
     *     (
     *         \s          |   # a whitespace char, or
     *         &nbsp;      |   # a non-breaking space entity, or
     *         --          |   # dashes, or
     *         &[mn]dash;  |   # named dash entities
     *         $dec_dashes |   # or decimal entities
     *         &\#x201[34];    # or hex
     *     )
     *     '                   # the quote
     *     (?=\w)              # followed by a word character
     * } {$1‘}xg;
     */
    str = str.replace(
        new RegExp(
            `(\\s|&nbsp;|--|&[mn]dash;|${dec_dashes}|&#x201[34])'(?=\\w)`,
            "g"
        ),
        "$1" + left_single_quotation_mark
    );

    /**
     * Single closing quotes:
     * s {
     *     ($close_class)?
     *     '
     *     (?(1)|          # If $1 captured, then do nothing;
     *       (?=\s | s\b)  # otherwise, positive lookahead for a whitespace
     *     )               # char or an 's' at a word ending position. This
     *                     # is a special case to handle something like:
     *                     # "<i>Custer</i>'s Last Stand."
     * } {$1’}xgi;
     */

    str = str.replace(
        new RegExp(`(${close_class})'`, "g"),
        "$1" + right_single_quotation_mark
    );
    str = str.replace(
        new RegExp(`(${not_close_class}?)'(?=\\s|s\\b)`, "g"),
        "$1" + right_single_quotation_mark
    );

    /**
     * Any remaining single quotes should be opening ones:
     */
    str = str.replace(/'/g, left_single_quotation_mark);

    /**
     * Get most opening double quotes:
     * s {
     *     (
     *         \s          |   # a whitespace char, or
     *         &nbsp;      |   # a non-breaking space entity, or
     *         --          |   # dashes, or
     *         &[mn]dash;  |   # named dash entities
     *         $dec_dashes |   # or decimal entities
     *         &\#x201[34];    # or hex
     *     )
     *     "                   # the quote
     *     (?=\w)              # followed by a word character
     * } {$1“}xg;
     */
    str = str.replace(
        new RegExp(
            `(\\s|&nbsp;|--|&[mn]dash;|${dec_dashes}|&#x201[34])"(?=\\w)`,
            "g"
        ),
        "$1" + left_double_quotation_mark
    );

    /**
     * Double closing quotes:
     * s {
     *     ($close_class)?
     *     "
     *     (?(1)|(?=\s))   # If $1 captured, then do nothing;
     *                        # if not, then make sure the next char is whitespace.
     * } {$1”}xg;
     */
    str = str.replace(
        new RegExp(`(${close_class})"`, "g"),
        "$1" + right_double_quotation_mark
    );
    str = str.replace(
        new RegExp(`(${not_close_class}?)"(?=\\s)`, "g"),
        "$1" + right_double_quotation_mark
    );

    /**
     * Any remaining quotes should be opening ones.
     */
    str = str.replace(/"/g, left_double_quotation_mark);

    return str;
};

/**
 * @param {string} str String
 * @return {string} The string, with ``backticks'' -style double quotes
 *                  translated into HTML curly quote entities.
 *
 * Example input:  ``Isn't this fun?''
 * Example output: “Isn't this fun?”
 */
const EducateBackticks = (str: string): string => {
    str = str.replace(/``/g, left_double_quotation_mark);
    str = str.replace(/''/g, right_double_quotation_mark);
    return str;
};

/**
 * @param {string} str String
 * @return {string} The string, with each instance of "--" translated to
 *                  an em-dash HTML entity.
 */
const EducateDashes = (str: string): string => {
    str = str.replace(/--/g, em_dash);
    return str;
};

/**
 * @param {string} str String
 * @return {string} The string, with each instance of "..." translated to
 *                  an ellipsis HTML entity. Also converts the case where
 *                  there are spaces between the dots.
 *
 * Example input:  Huh...?
 * Example output: Huh…?
 */
const EducateEllipses = (str: string): string => {
    str = str.replace(/\.\.\./g, horizontal_ellipsis);
    str = str.replace(/\. \. \./g, horizontal_ellipsis);
    return str;
};

/**
 * @param {string} str String
 * @return {string} string, with after processing the following backslash
 *                  escape sequences. This is useful if you want to force a "dumb"
 *                  quote or other character to appear.
 *
 *                  Escape  Value
 *                  ------  -----
 *                  \\      &#92;
 *                  \"      &#34;
 *                  \'      &#39;
 *                  \.      &#46;
 *                  \-      &#45;
 *                  \`      &#96;
 *
 */
const ProcessEscapes = (str: string): string => {
    str = str.replace(/\\\\/g, "\\");
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\'/g, "'");
    str = str.replace(/\\\./g, ".");
    str = str.replace(/\\-/g, "-");
    str = str.replace(/\\`/g, "`");
    return str;
};

/**
 * @param {string} str String containing HTML markup.
 * @return {Array<token>} Reference to an array of the tokens comprising the input
 *                        string. Each token is either a tag (possibly with nested,
 *                        tags contained therein, such as <a href="<MTFoo>">, or a
 *                        run of text between tags. Each element of the array is a
 *                        two-element array; the first is either 'tag' or 'text';
 *                        the second is the actual value.
 *
 * Based on the _tokenize() subroutine from Brad Choate's MTRegex plugin.
 *     <http://www.bradchoate.com/past/mtregex.php>
 */
const _tokenize = (str: string): Array<token> => {
    var pos = 0;
    var len = str.length;
    var tokens = [];

    var match = /<!--[\s\S]*?-->|<\?.*?\?>|<[^>]*>/g;

    var matched = null;

    while ((matched = match.exec(str))) {
        if (pos < matched.index) {
            let t: token = ["text", str.substring(pos, matched.index)];
            tokens.push(t);
        }
        let t: token = ["tag", matched.toString()];
        tokens.push(t);

        pos = match.lastIndex;
    }
    if (pos < len) {
        let t: token = ["text", str.substring(pos, len)];
        tokens.push(t);
    }

    return tokens;
};

export { SmartyPants as smartypants };
export default SmartyPants;
