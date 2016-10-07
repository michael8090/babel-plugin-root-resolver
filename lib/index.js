'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var t = _ref.types;

    var cwd = process.cwd();
    return {
        visitor: {
            CallExpression: function CallExpression(_ref2, state) {
                var node = _ref2.node;

                function renameAbsolutePath(e) {
                    if (e.type === 'StringLiteral' && e.value[0] === '/') {
                        var oldValue = e.value;
                        var newValue = _path2.default.relative(state.file.opts.filename, _path2.default.resolve(cwd, '.' + oldValue));
                        e.value = newValue;
                        // console.log(`${oldValue} > ${newValue}`);
                    }
                }
                var args = node.arguments;
                var callee = node.callee;

                if (callee.name === 'define') {
                    args.forEach(function (a) {
                        if (a.type === 'ArrayExpression') {
                            a.elements.forEach(renameAbsolutePath);
                        }
                    });
                }

                if (callee.name === 'require' || callee.type === 'MemberExpression' && callee.object.name === 'require' && callee.property.name === 'ensure') {
                    args.forEach(renameAbsolutePath);
                }
            }
        }
    };
}; /**
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