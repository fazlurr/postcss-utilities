import postcss from 'postcss';
import test    from 'ava';
import fs      from 'fs';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            fs.writeFileSync('test/out.css', result.css);
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

function runWithWarn(t, input, output, numberOfWarn, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, numberOfWarn);
        });
}

test('truncate multiline', t => {
    return run(t, 'a{ @util truncate (3, 1.5); }',
                  'a{ display: block; display: -webkit-box;' +
                  ' height: 4.5em; line-height: 1.5;' +
                  ' -webkit-line-clamp: 3; -webkit-box-orient: vertical;' +
                  ' overflow: hidden; text-overflow: ellipsis; }', { });
});

test('truncate multiline 2', t => {
    return run(t, 'a{ @util truncate(3, 1.5); }',
                  'a{ display: block; display: -webkit-box;' +
                  ' height: 4.5em; line-height: 1.5; -webkit-line-clamp: 3;' +
                  ' -webkit-box-orient: vertical; overflow: hidden;' +
                  ' text-overflow: ellipsis; }', { });
});

test('truncate multiline 3', t => {
    return run(t, 'a{ @util truncate(3 1.5); }',
                  'a{ display: block; display: -webkit-box; height: 4.5em;' +
                  ' line-height: 1.5; -webkit-line-clamp: 3;' +
                  ' -webkit-box-orient: vertical; overflow: hidden;' +
                  ' text-overflow: ellipsis; }', { });
});

test('truncate', t => {
    return run(t, 'a{ @util truncate; }',
                  'a{ white-space: nowrap; overflow: hidden;' +
                  ' text-overflow: ellipsis; }', { });
});

test('reset list', t => {
    return run(t, 'ul{ @util reset-list; }',
                  'ul{ margin-top: 0; margin-bottom: 0; padding-left: 0; }' +
                  '\nul li{ list-style: none; }', { });
});

test('hide visually', t => {
    return run(t, 'a{ @util hide-visually; }',
                  'a{ border: 0; clip: rect(0 0 0 0); height: 1px;' +
                  ' margin: -1px; overflow: hidden; padding: 0;' +
                  ' position: absolute; width: 1px; }', { });
});

test('clearfix', t => {
    return run(t, 'a{ @util clearfix; }',
                  'a:after {\n    content: \'\';\n    ' +
                  'display: block;\n    clear: both\n}', { });
});

test('text hide', t => {
    return run(t, 'a{ background: #000; color: #fff; @util text-hide; }',
                  'a{ background: #000; color: #fff; font: 0/0 a;' +
                  ' color: transparent; text-shadow: none;' +
                  ' background-color: transparent; border: 0; }', { });
});

test('triangle', t => {
    var input = fs.readFileSync('test/triangle.css', 'utf8');
    var output = fs.readFileSync('test/triangle.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('hd breakpoint', t => {
    var input = fs.readFileSync('test/hd.css', 'utf8');
    var output = fs.readFileSync('test/hd.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('warnings', t => {
    var input = fs.readFileSync('test/warnings.css', 'utf8');
    var output = fs.readFileSync('test/warnings.expect.css', 'utf8');
    return runWithWarn(t, input, output, 2, { });
});

test('with nested rules', t => {
    var input = fs.readFileSync('test/nested.css', 'utf8');
    var output = fs.readFileSync('test/nested.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('clearfix ie8', t => {
    var input = fs.readFileSync('test/clearfix-ie8.css', 'utf8');
    var output = fs.readFileSync('test/clearfix-ie8.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('var support', t => {
    var input = fs.readFileSync('test/vars.css', 'utf8');
    var output = fs.readFileSync('test/vars.expect.css', 'utf8');
    return run(t, input, output, {});
});

test('word wrap', t => {
    var input = fs.readFileSync('test/word-wrap.css', 'utf8');
    var output = fs.readFileSync('test/word-wrap.expect.css', 'utf8');
    return run(t, input, output, {});
});

test('size', t => {
    var input = fs.readFileSync('test/size.css', 'utf8');
    var output = fs.readFileSync('test/size.expect.css', 'utf8');
    return run(t, input, output, {});
});

test('sticky footer', t => {
    var input = fs.readFileSync('test/sticky-footer.css', 'utf8');
    var output = fs.readFileSync('test/sticky-footer.expect.css', 'utf8');
    return run(t, input, output, {});
});

test('reset text', t => {
    var input = fs.readFileSync('test/reset-text.css', 'utf8');
    var output = fs.readFileSync('test/reset-text.expect.css', 'utf8');
    return run(t, input, output, {});
});

test('border color', t => {
    var input = fs.readFileSync('test/border-color.css', 'utf8');
    var output = fs.readFileSync('test/border-color.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('all', t => {
    var input = fs.readFileSync('test/test.css', 'utf8');
    var output = fs.readFileSync('test/test.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('border style', t => {
    var input = fs.readFileSync('test/border-style.css', 'utf8');
    var output = fs.readFileSync('test/border-style.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('border width', t => {
    var input = fs.readFileSync('test/border-width.css', 'utf8');
    var output = fs.readFileSync('test/border-width.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('padding', t => {
    var input = fs.readFileSync('test/padding.css', 'utf8');
    var output = fs.readFileSync('test/padding.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('margin', t => {
    var input = fs.readFileSync('test/margin.css', 'utf8');
    var output = fs.readFileSync('test/margin.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('border radius', t => {
    var input = fs.readFileSync('test/border-radius.css', 'utf8');
    var output = fs.readFileSync('test/border-radius.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('position', t => {
    var input = fs.readFileSync('test/position.css', 'utf8');
    var output = fs.readFileSync('test/position.expect.css', 'utf8');
    return run(t, input, output, { });
});

test('text-stroke', t => {
    var input = fs.readFileSync('test/text-stroke.css', 'utf8');
    var output = fs.readFileSync('test/text-stroke.expect.css', 'utf8');
    return run(t, input, output, { });
});
