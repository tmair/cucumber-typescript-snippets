const CALLBACK_NAME = 'callback';

function TypeScriptSnippetSyntax(snippetInterface) {
  this.snippetInterface = snippetInterface;
}

TypeScriptSnippetSyntax.prototype.build = function({
  comment,
  generatedExpressions,
  functionName,
  stepParameterNames
}) {
  let functionKeyword = '';
  if (this.snippetInterface === 'generator') {
    functionKeyword += '*';
  }

  if (this.snippetInterface === 'promise') {
    functionKeyword = 'async ';
  }

  let implementation;
  if (this.snippetInterface === 'callback') {
    implementation = `${CALLBACK_NAME}(null, 'pending');`;
  } else {
    implementation = "return 'pending';";
  }

  const definitionChoices = generatedExpressions.map((generatedExpression, index) => {
    const prefix = index === 0 ? '' : '// ';

    const allParameterNames = generatedExpression.parameterNames
      .map(parameterName => `${parameterName}: any`)
      .concat(stepParameterNames.map(stepParameterName => `${stepParameterName}: any`));

    if (this.snippetInterface === 'callback') {
      allParameterNames.push(`${CALLBACK_NAME}: any`);
    }
    return (
      prefix +
      functionName +
      "('" +
      generatedExpression.source.replace(/'/g, "\\'") +
      "', " +
      functionKeyword +
      '(' +
      allParameterNames.join(', ') +
      ') => {\n'
    );
  });

  return definitionChoices.join('') + `  // ${comment}\n` + `  ${implementation}\n` + '});';
};

module.exports = TypeScriptSnippetSyntax;
