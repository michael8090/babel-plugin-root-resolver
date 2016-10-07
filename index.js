/**
 * Created by yiming on 2016/8/18.
 * in:
 *      define('id', ['/otherDir/componnent/a'], function () {})
 *      require('/otherDir/componnent/a');
 *
 * out:
 *      define('id', ['../../otherDir/componnent/a'], function () {})
 *      require('../../otherDir/componnent/a');
 *
 */
import path from 'path';

export default ({types: t}) => {
    const cwd = process.cwd();
    return {
        visitor: {
            CallExpression({node}, state) {
                function renameAbsolutePath(e) {
                    if (e.type === 'StringLiteral' && e.value[0] === '/') {
                        const oldValue = e.value;
                        const newValue = path.relative(state.file.opts.filename, path.resolve(cwd, '.' + oldValue));
                        e.value = newValue;
                        // console.log(`${oldValue} > ${newValue}`);
                    }
                }
                const args = node.arguments;
                const {callee} = node;
                if (callee.name === 'define') {
                    args.forEach(a => {
                        if (a.type === 'ArrayExpression') {
                            a.elements.forEach(renameAbsolutePath);
                        }
                    });
                }

                if (callee.name === 'require' || (callee.type === 'MemberExpression' && callee.object.name === 'require' && callee.property.name === 'ensure')) {
                    args.forEach(renameAbsolutePath);
                }
            }
        }
    };
};
